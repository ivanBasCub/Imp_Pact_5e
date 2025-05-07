import React from "react";
import { marked } from "marked";
/**
 * Componente que renderiza contenido Markdown como HTML seguro.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.markdown - Cadena en formato Markdown que se desea renderizar.
 * @returns {JSX.Element} HTML generado a partir del Markdown proporcionado.
 */
const MarkdownViewer = ({ markdown }) => {
    /**
     * Convierte la cadena Markdown en HTML usando `marked`.
     *
     * @returns {{ __html: string }} Objeto con propiedad __html para uso con dangerouslySetInnerHTML.
     */
    const createMarkup = () => {
        return { __html: marked(markdown) };
    };

    return (
        // Renderiza el HTML generado a partir del Markdown
        // ⚠️ Se usa `dangerouslySetInnerHTML` para inyectar HTML. Asegúrate de confiar en el contenido o sanearlo antes.
        <div dangerouslySetInnerHTML={createMarkup()} />
    );
};

export default MarkdownViewer;