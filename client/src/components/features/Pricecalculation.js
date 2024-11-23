export const paperProductPriceCalculation = (uploadData) => {
  const basePrice = uploadData.copy * uploadData.pages;
  const colorPrice = uploadData.printcolor === 'b&w' ? 1 : 10;

  const paperSizeMultiplier =
    uploadData.papersize === '75gsm-paper' ? 1 :
      uploadData.papersize === '80gsm-paper' ? 1.1 :
        uploadData.papersize === '90gsm-bond-paper' ? 1.2 :
          uploadData.papersize === '100gsm-bond-paper' ? 1.4 :
            uploadData.papersize === '100gsm-paper' ? 1.5 : 1;

  const paperTypeMultiplier =
    uploadData.papertype === 'A4' ? 1 :
      uploadData.papertype === 'A3' ? 1.25 :
        uploadData.papertype === 'A2' ? 1.5 :
          uploadData.papertype === 'A1' ? 1.75 : 2.5;

  const printingSideMultiplier =
    uploadData.printingside === 'single-side' ? uploadData.price : uploadData.price * 1.75;

  const bindingCost =
    uploadData.binding === 'no-binding' || uploadData.binding === 'corner-stapling' ? 0 :
      uploadData.binding === 'glue-tape-stable-binding' ? 10 :
        uploadData.binding === 'spiral-binding' ? 15 :
          uploadData.binding === 'spiral-binding-with-harcover' ? 20 : 22;

  const adjustedPrice = basePrice * printingSideMultiplier * paperTypeMultiplier * paperSizeMultiplier * colorPrice;
  const totalPrice = adjustedPrice + bindingCost;

  return { totalPrice, bindingCost };
};
