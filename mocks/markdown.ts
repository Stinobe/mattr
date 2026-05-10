export const firstParagraph = "This is the first paragraph";
export const secondParagraph = "This is the second paragraph";
export const thirdParagraph = "This is the third paragraph";
export const excerptSeparator = "<!-- excerpt -->";

export const noFrontmatterMarkdown = `${firstParagraph}

${secondParagraph}

${excerptSeparator}

${thirdParagraph}
`;

export const markdown = `---
title: Hello World
---
${noFrontmatterMarkdown}
`;

export const invalidMarkdown = `---
title: Hello World

${noFrontmatterMarkdown}
`;

export const invalidYamlMarkdown = `---
title: "Hello World
---
${noFrontmatterMarkdown}
`;
