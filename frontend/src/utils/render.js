 export  async function render(htmlElement) {
    const loadElement = htmlElement.getElement;    
    const element = await loadElement();
    const elementToRender = element.default || element;

    const nodeParent = htmlElement.nodeParent; // ID del contenedor principal 

    const nodeParentElement = document.getElementById(nodeParent);
    console.log(nodeParentElement);
    
    
    if (typeof elementToRender === "function") {
        nodeParentElement.innerHTML = elementToRender();
    } else if (typeof elementToRender === "string") {
        nodeParentElement.innerHTML = elementToRender;
    } else {
        nodeParentElement.innerHTML = elementToRender.render ? elementToRender.render() : elementToRender.template || "";
    }

    // Ejecutar afterRender si existe
    if (elementToRender.afterRender) {
        elementToRender.afterRender();
    }
}
