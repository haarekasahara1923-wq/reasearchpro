import axios from "axios";

export async function lookupDOI(doi: string) {
    try {
        const response = await axios.get(`https://api.crossref.org/works/${doi}`);
        const data = response.data.message;

        return {
            title: data.title[0],
            authors: data.author?.map((a: any) => `${a.given} ${a.family}`).join(", "),
            journal: data["container-title"]?.[0] || data.publisher,
            year: data.issued?.["date-parts"]?.[0]?.[0],
            doi: data.DOI,
            url: data.URL,
        };
    } catch (error) {
        console.error("DOI_LOOKUP_ERROR", error);
        throw new Error("Could not find DOI information");
    }
}

export function formatCitation(data: any, style: "APA" | "MLA" | "CHICAGO" = "APA") {
    const { authors, year, title, journal, url } = data;

    if (style === "APA") {
        return `${authors} (${year}). ${title}. ${journal}. ${url}`;
    }
    // Simplified for demo, can be expanded
    return `${authors}. "${title}." ${journal}, ${year}. ${url}`;
}
