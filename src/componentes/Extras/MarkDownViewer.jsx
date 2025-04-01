import React from "react";
import { marked } from "marked";

const MarkdownViewer = ({ markdown }) => {
    const createMarkup = () => {
        return { __html: marked(markdown) };
    };

    return (
        <div dangerouslySetInnerHTML={createMarkup()} />
    );
};

export default MarkdownViewer;