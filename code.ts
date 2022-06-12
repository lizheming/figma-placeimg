figma.showUI(__html__, {
  width: 450,
  height: 240,
});
eval('console.log(figma)');

figma.ui.onmessage = msg => {
  if (msg.type === 'insert') {
    let rectNode: RectangleNode;
    if (figma.currentPage.selection.length === 1 && figma.currentPage.selection[0].type === 'RECTANGLE') {
      rectNode = figma.currentPage.selection[0];
    } else {
      rectNode = figma.createRectangle();
    }
    // const rectNode = figma.createRectangle();
    const image = figma.createImage(msg.bytes);

    rectNode.name = 'Image';
    rectNode.resize(msg.width, msg.height);
    rectNode.fills = [{
      imageHash: image.hash,
      scaleMode: 'FILL',
      scalingFactor: 0.5,
      type: 'IMAGE'
    }];
    
    figma.currentPage.appendChild(rectNode);
    figma.currentPage.selection = [rectNode];
    figma.viewport.scrollAndZoomIntoView([rectNode]);
  }

  figma.closePlugin();
};

function initSelectionState() {
  if (figma.currentPage.selection.length === 1 && figma.currentPage.selection[0].type === 'RECTANGLE') {
    const rectNode = figma.currentPage.selection[0];
    figma.ui.postMessage({ type: 'update', width: rectNode.width, height: rectNode.height });
  }
}
figma.on('selectionchange', initSelectionState);
initSelectionState();
