// Obtener elementos del DOM
const potenciometro1Container = document.getElementById('potenciometro1Container');
const potenciometro2Container = document.getElementById('potenciometro2Container');
const potenciometro3Container = document.getElementById('potenciometro3Container');
const potenciometro4Container = document.getElementById('potenciometro4Container');
const potenciometro5Container = document.getElementById('potenciometro5Container');
const potenciometro6Container = document.getElementById('potenciometro6Container');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let imagenOriginal = null; // Variable para almacenar la imagen original
let imagenActual = null; // Variable para almacenar la imagen actual
let appliedEffects = []; // Array para almacenar los efectos aplicados

// Función para subir archivo y mostrar en el canvass
const uploadButton = document.getElementById('uploadButton');
uploadButton.addEventListener('click', function() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';

  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
      const imageDataUrl = reader.result;
      imagenOriginal = new Image();
      imagenOriginal.onload = function() {
        canvas.width = imagenOriginal.width;
        canvas.height = imagenOriginal.height;
        ctx.drawImage(imagenOriginal, 0, 0);
        imagenActual = new Image();
        imagenActual.src = imageDataUrl;
      };
      imagenOriginal.src = imageDataUrl;
    };
    
    reader.readAsDataURL(file);
  });

  fileInput.click();

  function restoreCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imagenOriginal, 0, 0);
  }
  
});

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// APLICAR EFECTOS ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// RANDOMSHIFTX ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

// Función para aplicar el efecto de randomShiftX
function applyRandomShiftX(angle, pixelAmount) {
  const distortionX = Math.sin(angle * Math.PI / 180) * pixelAmount;
  ctx.translate(distortionX, 0);
  ctx.drawImage(imagenActual, 40, 0);
  imagenActual.src = canvas.toDataURL();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// HUEROTATE //////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


// Función para aplicar el efecto de HueRotate
function applyHueRotate(angle, pixelAmount) {
  // Aplica el filtro de hue-rotate al canvas
  ctx.filter = `hue-rotate(${angle}deg)`;
  ctx.drawImage(imagenActual, 0, 0);
  imagenActual.src = canvas.toDataURL();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// SATURATION /////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


// Función para aplicar el efecto de saturación
function applySaturation(angle, pixelAmount) {
  // Aplica el filtro de saturate al canvas
  ctx.filter = `saturate(${angle}%)`;
  ctx.drawImage(imagenActual, 8, 3);
  imagenActual.src = canvas.toDataURL();
}

// // Función para aplicar el efecto de noiseLevel
 function applyNoiseLevel(angle, pixelAmount) {
   const noise = Math.floor(Math.random() * pixelAmount * 2) - pixelAmount;
   // Aplicar efecto de ruido
   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
   for (let i = 0; i < imageData.data.length; i += 4) {
     imageData.data[i] += noise; // Yellow
     imageData.data[i + 1] += noise; // Green
     imageData.data[i + 2] += noise; // Blue
   }
   ctx.putImageData(imageData, 0, 0);
 }


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// YDISTORSION ////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////



// Función para aplicar el efecto de distorsión en el eje Y
function applyYDistortion(angle, pixelAmount) {
  const distortionY = Math.sin(angle * Math.PI / 360) * pixelAmount;
  ctx.translate(0, distortionY);
  ctx.drawImage(imagenActual, 0, 40);
  imagenActual.src = canvas.toDataURL();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// XDISTORSION ////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


// Función para aplicar el efecto de distorsión en el eje X con pixelado
function applyXDistortion(angle, pixelAmount) {
  // Convertir el ángulo a radianes
  const radians = angle * Math.PI / 180;
  // Obtener la imagen original del canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Crear un nuevo array para los datos de la imagen distorsionada
  const distortedData = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calcular la posición original
      const originalOffset = (y * width + x) * 4;

      // Calcular la cantidad de distorsión en x con un componente aleatorio
      const distortionX = Math.sin(radians) * pixelAmount * 30 * (Math.random() * 2 - 1); // Aumentamos el factor de distorsión

      // Calcular la nueva posición con distorsión
      const newX = x + Math.round(distortionX * (height - y) / height); // Ajuste basado en la posición vertical

      // Copiar los píxeles originales a la nueva posición con distorsión
      if (newX >= 0 && newX < width) {
        const newOffset = (y * width + newX) * 4;
        distortedData[newOffset] = data[originalOffset];
        distortedData[newOffset + 1] = data[originalOffset + 1];
        distortedData[newOffset + 2] = data[originalOffset + 2];
        distortedData[newOffset + 3] = data[originalOffset + 3];
      }
    }
  }

  // Crear una nueva imagen con los datos distorsionados
  const distortedImage = new ImageData(distortedData, width, height);

  // Limpiar el canvas y dibujar la imagen distorsionada
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(distortedImage, 0, 0);

  // No aplicamos el efecto de pixelado aquí

  // Actualizar la imagen actual para futuros efectos
  imagenActual = new Image();
  imagenActual.src = canvas.toDataURL();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// PIXEL AMOUNT ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


// Función para aplicar el efecto de pixelado con reducción de resolución mejorado
function applyPixelAmount(pixelAmount) {
  // Límite máximo para el tamaño del píxel ❗️PARA FOTOS DE 500X500❗️
  const maxPixelSize = 2;

  // Calcular el tamaño del píxel respetando el límite máximo
  const pixelSize = Math.min(+pixelAmount, maxPixelSize);

  // Obtener una versión reducida de la imagen original
  const reducedWidth = Math.floor(canvas.width / pixelSize);
  const reducedHeight = Math.floor(canvas.height / pixelSize);
  const reducedCanvas = document.createElement('canvas');
  const reducedCtx = reducedCanvas.getContext('2d');
  reducedCanvas.width = reducedWidth;
  reducedCanvas.height = reducedHeight;
  reducedCtx.drawImage(canvas, 0, 0, reducedWidth, reducedHeight);

  // Limpiar cualquier filtro previo (como hue-rotate)
  ctx.filter = 'none';

  // Aplicar el efecto de pixelado a la imagen reducida
  reducedCtx.imageSmoothingEnabled = false;
  reducedCtx.drawImage(reducedCanvas, 0, 0, reducedWidth, reducedHeight, 0, 0, reducedWidth / pixelSize, reducedHeight / pixelSize);

  // Escalar la imagen reducida de vuelta a su tamaño original
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(reducedCanvas, 0, 0, reducedWidth / pixelSize, reducedHeight / pixelSize, 0, 0, canvas.width, canvas.height);

  // Actualizar la imagen actual para futuros efectos
  imagenActual.src = canvas.toDataURL();
}

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// ASIGNAR EVENTOS ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


// Función para asignar eventos a cada potenciómetro
function assignPotenciometroEvents(potenciometroContainer, effectFunction, effectType) {
  const maxAngle = 360; // Ángulo máximo del potenciómetro

  potenciometroContainer.addEventListener('mousedown', function(e) {
    const startX = e.clientX;
    const startY = e.clientY;
    let startRotation = parseInt(potenciometroContainer.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;

    function rotatePotenciometro(e) {
      const offsetX = e.clientX - startX;
      let newRotation = startRotation + offsetX;

      // Limitar el ángulo entre 0 y maxAngle
      newRotation = Math.max(0, Math.min(maxAngle, newRotation));

      potenciometroContainer.style.transform = `rotate(${newRotation}deg)`;

      effectFunction(newRotation, effectType);
    }

    document.addEventListener('mousemove', rotatePotenciometro);

    document.addEventListener('mouseup', function() {
      document.removeEventListener('mousemove', rotatePotenciometro);
    });
  });
}


// Asignar eventos a cada potenciómetro con su respectivo efecto
assignPotenciometroEvents(potenciometro1Container, applyYDistortion, 1);
assignPotenciometroEvents(potenciometro2Container, applyXDistortion, 2);
assignPotenciometroEvents(potenciometro3Container, applyPixelAmount, 3);
assignPotenciometroEvents(potenciometro4Container, applyHueRotate, 4);
assignPotenciometroEvents(potenciometro5Container, applySaturation, 5);
assignPotenciometroEvents(potenciometro6Container, applyRandomShiftX, 6);


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// BOTÓN DESCARGA ✅ /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


// Obtener el botón de descarga del DOM
const downloadButton = document.getElementById('downloadButton');

// Agregar evento de clic al botón de descarga
downloadButton.addEventListener('click', function() {
  if (imagenActual) {
    const link = document.createElement('a');
    link.download = 'YourhappyAccident.jpg'; // Nombre de la imagen al descargar en JPEG
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.click();
  } else {
    alert('No hay ningun Happy Accident para descargar :(');
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// BOTÓN RESET (DOBLE FUNCIONALIDAD) ✅ //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

// TODO 

    /*
    socket.on('digitalPotentiometer', function(data) {
                
      switch (data[key]) {
        case 'Pot1':
        applyYDistortion(data[Pot1].value,1);
        break;
        case 'Pot1':
        applyXDistortion(data[Pot2].value,2);
        break;
        case 'Pot1':
        applyPixelAmount(data[Pot3].value,3);
        break;
        case 'Pot1':
        applyHueRotate(data[Pot4].value,4);
        break;
        case 'Pot1':
        applySaturation(data[Pot1].value,5);
        break;
        case 'Pot1':
        applyRandomShiftX(data[Pot1].value,6);
        break;
      }
                        
              });
              */

// Variables para controlar el doble clic y la eliminación de la imagen
let lastClickTime = 0;
const doubleClickThreshold = 250; // Umbral de tiempo para considerar un doble clic en milisegundos

// Función para limpiar completamente el canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  imagenOriginal = null;
  imagenActual = null;
}

// Función para limpiar todos los efectos aplicados a la imagen y resetear los potenciómetros
resetButton.addEventListener('click', function(event) {
  const currentTime = new Date().getTime();
  const clickDiff = currentTime - lastClickTime;

  if (clickDiff < doubleClickThreshold) {
    // Doble clic
    // Limpiar completamente el canvas
    clearCanvas();
  } else {
    // Primer clic
    // Limpiar filtros y transformaciones del canvas
    ctx.filter = 'none';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = 'saturate(100%)'; // Restaurar la saturación predeterminada

    // Limpiar efectos aplicados al canvas
    appliedEffects.forEach(effect => effect());
    appliedEffects = [];

// Restaurar la imagen original si existe
if (imagenOriginal) {
  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Clonar la imagen original para evitar problemas de color
  const clonedImage = new Image();
  clonedImage.src = imagenOriginal.src;

  // Dibujar la imagen clonada
  clonedImage.onload = function() {
    ctx.drawImage(clonedImage, 0, 0);
  };
  
  // Asignar la imagen clonada a imagenActual para futuros efectos
  imagenActual = clonedImage;
  
  // Restablecer la saturación a su valor predeterminado
  ctx.filter = 'saturate(100%)';
}

    // Resetear la rotación de los potenciómetros
    [potenciometro1Container, potenciometro2Container, potenciometro3Container, potenciometro4Container, potenciometro5Container, potenciometro6Container].forEach(container => {
      container.style.transform = 'rotate(0deg)';
    });
  }

  lastClickTime = currentTime;

  // Evitar la selección de texto en el botón
  event.preventDefault();
});

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// FIN CÓDIGO /////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
