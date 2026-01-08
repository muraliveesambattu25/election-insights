import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    name?: string;
    type?: string;
}

export const SEO = ({
    title,
    description = "Detailed insights and analytics for the Andhra Pradesh Assembly Elections 2024 results, performance by party, and district-wise breakdown.",
    name = "AP Assembly Elections 2024",
    type = "website"
}: SEOProps) => {
    const fullTitle = title ? `${title} | ${name}` : name;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={name} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
};
