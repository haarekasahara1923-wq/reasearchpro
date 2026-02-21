import pptxgen from "pptxgenjs";

export async function generatePPT(projectTitle: string, sections: { title: string, content: string }[]) {
    const pres = new pptxgen();

    // Title Slide
    let slide = pres.addSlide();
    slide.addText(projectTitle, {
        x: 0, y: "40%", w: "100%", h: 2,
        align: "center", fontSize: 44, color: "363636", bold: true
    });
    slide.addText("Research Presentation", {
        x: 0, y: "60%", w: "100%",
        align: "center", fontSize: 24, color: "666666"
    });

    // Content Slides
    sections.forEach(section => {
        let s = pres.addSlide();
        s.addText(section.title, {
            x: 0.5, y: 0.5, w: "90%", h: 1,
            fontSize: 32, color: "363636", bold: true, underline: { style: "sng" }
        });

        // Simple content splitting (demo purposes)
        const bulletPoints = section.content.split("\n")
            .filter(line => line.trim().length > 10)
            .slice(0, 5)
            .map(line => ({ text: line.trim().substring(0, 100) + "..." }));

        s.addText(bulletPoints, {
            x: 0.5, y: 1.5, w: "90%", h: 4,
            fontSize: 18, bullet: true, color: "444444"
        });
    });

    return pres.write(); // Returns a Buffer or Base64 depending on environment
}
