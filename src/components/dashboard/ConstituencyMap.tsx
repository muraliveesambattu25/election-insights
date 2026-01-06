import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ConstituencyData } from "@/types/election";
import { getPartyColor } from "@/lib/partyColors";
import { constituencyCoordinates } from "@/data/constituencyCoordinates";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Key } from "lucide-react";

interface ConstituencyMapProps {
  constituencies: ConstituencyData[];
  onConstituencyClick?: (acNo: number) => void;
}

export function ConstituencyMap({ constituencies, onConstituencyClick }: ConstituencyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState(() => 
    localStorage.getItem("mapbox_token") || ""
  );
  const [tokenInput, setTokenInput] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const saveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem("mapbox_token", tokenInput.trim());
      setMapboxToken(tokenInput.trim());
    }
  };

  const clearToken = () => {
    localStorage.removeItem("mapbox_token");
    setMapboxToken("");
    setTokenInput("");
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    setIsMapLoaded(false);
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [79.5, 15.9], // Center of Andhra Pradesh
        zoom: 6.5,
        pitch: 30,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        "top-right"
      );

      map.current.on("load", () => {
        setIsMapLoaded(true);
      });

      return () => {
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];
        map.current?.remove();
        map.current = null;
      };
    } catch (error) {
      console.error("Map initialization error:", error);
      clearToken();
    }
  }, [mapboxToken]);

  // Add markers when map is loaded
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    constituencies.forEach((constituency) => {
      const coords = constituencyCoordinates[constituency.AC_No];
      if (!coords) return;

      const partyColor = getPartyColor(constituency.Winner_Details.Party);

      // Create marker element
      const el = document.createElement("div");
      el.className = "constituency-marker";
      el.style.cssText = `
        width: 14px;
        height: 14px;
        background-color: ${partyColor};
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        transition: transform 0.2s ease;
      `;

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.5)";
        el.style.zIndex = "1000";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
        el.style.zIndex = "auto";
      });

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 15,
        closeButton: false,
        className: "constituency-popup",
      }).setHTML(`
        <div style="padding: 8px; min-width: 160px;">
          <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">
            ${constituency.AC_No}. ${constituency.Constituency_Name}
          </div>
          <div style="font-size: 12px; color: #888; margin-bottom: 4px;">
            ${constituency.Winner_Details.Name}
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background-color: ${partyColor};
            "></span>
            <span style="font-size: 12px; font-weight: 500;">${constituency.Winner_Details.Party}</span>
          </div>
          <div style="font-size: 11px; color: #666; margin-top: 4px;">
            Margin: +${constituency.Winning_Margin.toLocaleString()}
          </div>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener("click", () => {
        if (onConstituencyClick) {
          onConstituencyClick(constituency.AC_No);
        }
      });

      markersRef.current.push(marker);
    });
  }, [constituencies, isMapLoaded, onConstituencyClick]);

  if (!mapboxToken) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Constituency Map</h3>
        </div>
        <div className="bg-muted/50 rounded-lg p-6 text-center space-y-4">
          <Key className="h-10 w-10 text-muted-foreground mx-auto" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Mapbox API Token Required
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Get your free public token from{" "}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                mapbox.com
              </a>{" "}
              → Account → Tokens
            </p>
          </div>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="pk.eyJ1Ijo..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={saveToken} disabled={!tokenInput.trim()}>
              Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm animate-fade-in overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Constituency Map</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={clearToken}>
          Change Token
        </Button>
      </div>
      <div ref={mapContainer} className="h-[400px] w-full" />
      {/* Party Legend */}
      <div className="p-3 border-t border-border flex flex-wrap gap-3">
        {["TDP", "YSRCP", "JSP", "BJP", "INC"].map((party) => (
          <div key={party} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getPartyColor(party) }}
            />
            <span className="text-xs text-muted-foreground">{party}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
