import axios from "axios";

export async function lookupDOI(doi: string) {
    try {
        const response = await axios.get(`https://api.crossref.org/works/${doi}`);
        const data = response.data.message;

        return {
            title: data.title?.[0] || "Unknown Title",
            authors: data.author?.map((a: any) => `${a.given || ""} ${a.family || ""}`).join(", ") || "Unknown Authors",
            journal: data["container-title"]?.[0] || data.publisher || "Unknown Source",
            year: data.issued?.["date-parts"]?.[0]?.[0] || "n.d.",
            doi: data.DOI,
            url: data.URL || `https://doi.org/${data.DOI}`,
        };
    } catch (error) {
        console.error("DOI_LOOKUP_ERROR", error);
        throw new Error("Could not find DOI information. Please check the DOI string.");
    }
}

export async function searchCitations(query: string) {
    try {
        const response = await axios.get(`https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=5`);
        const items = response.data.message.items;

        return items.map((data: any) => ({
            title: data.title?.[0] || "Unknown Title",
            authors: data.author?.map((a: any) => `${a.given || ""} ${a.family || ""}`).join(", ") || "Unknown Authors",
            journal: data["container-title"]?.[0] || data.publisher || "Unknown Source",
            year: data.issued?.["date-parts"]?.[0]?.[0] || "n.d.",
            doi: data.DOI,
            url: data.URL || (data.DOI ? `https://doi.org/${data.DOI}` : null),
        }));
    } catch (error) {
        console.error("CITATION_SEARCH_ERROR", error);
        throw new Error("Could not search for citations.");
    }
}

export function formatCitation(data: any, style: string = "APA") {
    const { authors, year, title, journal, url } = data;

    if (style === "MLA") {
        return `${authors}. "${title}." ${journal}, ${year}, ${url || ""}.`;
    }
    if (style === "CHICAGO") {
        return `${authors}. "${title}." ${journal} (${year}). ${url || ""}.`;
    }

    // Default APA
    return `${authors} (${year}). ${title}. ${journal}. ${url || ""}`;
}
