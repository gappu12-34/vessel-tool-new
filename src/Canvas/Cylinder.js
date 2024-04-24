import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faSearchMinus,faUndo } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import signImage from '../linde_real.png'; 

// import FileUpload from '../FileUpload'; 



const Cylinder = () => {
  const canvasRef = useRef(null);
  const [innerDiameterInMM, setInnerDiameterInMM] = useState(150);
  const [heightInMM, setHeightInMM] = useState(160);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [wallThickness, setWallThickness] = useState(2);
  const [wallThicknessupper, setWallThicknessupper] = useState(10);
  const [outerDiameter, setOuterDiameter] = useState(innerDiameterInMM + 2 * wallThickness);
  const [orientation, setOrientation] = useState('vertical');
  const [generateCylinder, setGenerateCylinder] = useState(false);
  const [clearCanvas, setClearCanvas] = useState(false);
  const [activeTab, setActiveTab] = useState('General');
  const [nozzleName, setNozzleName] = useState('');
  const [nozzlePosition, setNozzlePosition] = useState('');
  const [VesselTag, setVesselTag] = useState('');
  const [nozzleData, setNozzleData] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [NozzleLength, setNozzleLength] = useState('');
  const [uploadedData, setUploadedData] = useState(null);
  const [showGeneral, setShowGeneral] = useState(true);
  const [Description, setDescription] = useState();
  const [alerts, setAlerts] = useState([]);
  const [topRectangleLength, setTopRectangleLength] = useState(null);
  
 

  



  useEffect(() => {
    if (generateCylinder || clearCanvas) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

     
  
      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      
      const updatedOuterDiameter = innerDiameterInMM + 2 * wallThickness;
  
      
      setOuterDiameter(updatedOuterDiameter);
  
      // Draw the rotated cylinder
      drawRotatedCylinder(
        context,
        innerDiameterInMM,
        heightInMM,
        rotationAngle,
        wallThickness,
        nozzleData
      );
  
      // Draw the "Result" text
      context.font = '30px Arial';
      context.fillStyle = 'black';
      context.fillText('', 50, 50);
  
      // Reset generateCylinder state to false
      setGenerateCylinder(false);
  
      // Reset clearCanvas state to false
      setClearCanvas(false);
      
      
    }
  }, [generateCylinder, innerDiameterInMM, heightInMM, wallThickness, clearCanvas, nozzleData,zoom,rotationAngle]);

  
  
  

  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');


    
    context.font = '30px Arial';

    // Set text color
    context.fillStyle = 'black';

    // Write text on the canvas
    context.fillText('Result', 50, 50);
  }, []);

  

  
  
 
  
  const drawCylinder = (context, innerDiameter, height, wallThickness, nozzles, lineLength,selectedLength) => {
    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2 + 100;
    const outerDiameter = innerDiameter + 2 * wallThickness;
  
    // Set the cylinder thickness
    context.lineWidth = wallThickness;
  
    // Draw the outer base circle (bottom part)
    drawBottomArc(context, centerX, centerY, outerDiameter);

    drawUpperArc(context, centerX, centerY, outerDiameter, height, selectedLength);
  
    // Draw the inner diameter line
    const lineY = centerY + 10;
    context.beginPath();
    context.moveTo(centerX - innerDiameter / 2, lineY);
    context.lineTo(centerX + innerDiameter / 2, lineY);
    context.stroke();
  
    // Display the inner diameter below the line
    context.font = '11px Arial';
    context.fillStyle = 'black';
    const innerDiameterText = `${innerDiameter}mm`;
    const textWidth = context.measureText(innerDiameterText).width;
    context.fillText(innerDiameterText, centerX - textWidth / 2, lineY - 6);
  
    // Connect the circles with vertical lines
    context.beginPath();
    context.moveTo(centerX - outerDiameter / 2, centerY);
    context.lineTo(centerX - outerDiameter / 2, centerY - height);
    context.moveTo(centerX + outerDiameter / 2, centerY);
    context.lineTo(centerX + outerDiameter / 2, centerY - height);
    context.stroke();
  
    // Draw the line next to the cylinder
    const lineDistanceFromOuterEdge = 22;
    const updatedOuterDiameter = innerDiameter + 2 * wallThickness;
  
    context.lineWidth = 2;
context.beginPath();
context.moveTo(centerY + updatedOuterDiameter / 2 + lineDistanceFromOuterEdge, centerY);
context.lineTo(centerY + updatedOuterDiameter / 2 + lineDistanceFromOuterEdge, centerY - height);
context.stroke();

// Draw little lines at both ends
const littleLineLength = 8; // Length of the little lines
const halfLittleLineLength = littleLineLength / 2;

// Draw little line at the top endpoint
context.beginPath();
context.moveTo(centerY + updatedOuterDiameter / 2 + lineDistanceFromOuterEdge - halfLittleLineLength, centerY - height);
context.lineTo(centerY + updatedOuterDiameter / 2 + lineDistanceFromOuterEdge + halfLittleLineLength, centerY - height);
context.stroke();

// Draw little line at the bottom endpoint
context.beginPath();
context.moveTo(centerY + updatedOuterDiameter / 2 + lineDistanceFromOuterEdge - halfLittleLineLength, centerY);
context.lineTo(centerY + updatedOuterDiameter / 2 + lineDistanceFromOuterEdge + halfLittleLineLength, centerY);
context.stroke();

  
    // Display height near the lines
    context.font = '14px Arial';
    context.fillStyle = 'black';
    const text = `${height}mm`;
  
    // Draw lines connecting text to points on the cylinder
    context.beginPath();
    context.moveTo(centerX + outerDiameter / 2 + 40, centerY - height / 2);
    context.stroke();
  
    // Draw text
    context.fillText(text, centerX + outerDiameter / 2 + 60, centerY - height / 2 - 10);
  
    switch (nozzlePosition) {
      case 'top':
        drawRectangleOnUpperArc(context, centerX, centerY, outerDiameter, height, innerDiameter, 10, 10); // Adjust the line lengths as needed
        break;
      case 'right':
        drawRectangleOnRightSide(context, centerX, centerY, outerDiameter, height, innerDiameter, nozzlePosition);
        break;
      case 'left':
        drawRectangleOnLeftSide(context, centerX, centerY, outerDiameter, height, nozzlePosition, lineLength);
        break;
      case 'bottom':
        drawRectangleOnBottomArc(context, centerX, centerY, outerDiameter, height, innerDiameter, 15, 15); // Adjust the line lengths as needed
        break;
      default:
    } 
  };

 
  
  
  // All Variables start from here
  
  const handleWallThicknessChange = (e) => {
    const thickness = parseInt(e.target.value, 10);
    setWallThickness(thickness);
    setWallThicknessupper(thickness);
    setOuterDiameter(innerDiameterInMM + 2 * thickness);
  };

const drawRotatedCylinder = (context, innerDiameter, height, angle, wallThickness, nozzleData) => {
    if (!canvasRef.current) {
        console.error("Canvas reference is not available.");
        return;
    }

    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;

    // Clear only the upper arc and bottom arc
    clearUpperAndBottomArc(context, innerDiameter, height, wallThickness, centerX, centerY);

    context.save();

    context.translate(centerX, centerY);
    context.rotate(angle * (Math.PI / 180));
    context.translate(-centerX, -centerY);

    // Draw the cylinder
    drawCylinder(context, innerDiameter, height, wallThickness);

    context.restore();

    // Draw the "Result" text
    context.font = '30px Arial';
    context.fillStyle = 'black';
    context.fillText('Result', 50, 50);
};

// Function to clear only the upper arc and bottom arc
const clearUpperAndBottomArc = (context, innerDiameter, height, wallThickness, centerX, centerY) => {
    // Calculate the radius of the cylinder
    const radius = innerDiameter / 2;

    // Calculate the position of the upper arc
    const upperArcY = (context.canvas.height - height) / 2;

    // Calculate the position of the bottom arc
    const bottomArcY = (context.canvas.height + height) / 2;

    // Clear the upper arc
    const upperArcHeight = radius - wallThickness / 2;
    context.clearRect(
        (context.canvas.width - innerDiameter) / 2,
        upperArcY,
        innerDiameter,
        upperArcHeight
    );

    // Clear the bottom arc
    const bottomArcHeight = radius - wallThickness / 2;
    context.clearRect(
        (context.canvas.width - innerDiameter) / 2,
        bottomArcY - upperArcHeight,
        innerDiameter,
        bottomArcHeight
    );

   
};


  const handleInnerDiameterChange = (e) => {
    const diameter = parseInt(e.target.value, 10);
    setInnerDiameterInMM(diameter);
    setOuterDiameter(diameter + 2 * wallThickness);
  };



  const handleHeightChange = (e) => {
    const height = parseInt(e.target.value, 10);
    setHeightInMM(height);
  };

  

  const rotation = (e) => {
    setRotationAngle(orientation === 'vertical' ? 90 : 0);
    setOrientation(e.target.value);
  };

  const handleGenerate = () => {
    // Check if any of the required values are missing
    if (!innerDiameterInMM || !wallThickness || !heightInMM) {
        // Show Bootstrap alert message for missing values
        showAlert("Please enter values for Inner Diameter, Wall Thickness, and Height.", "error");
        return;
    }
    
    // Proceed with generating the vessel
    setGenerateCylinder(true);
    
    // Show alert message indicating the vessel is generated
    showAlert("Vessel is generated.", "success");
};

  
  const showAlert = (message, type) => {
  const alertContainer = document.getElementById('alertContainer');

  if (!alertContainer) {
    console.error("Alert container not found");
    return;
  }

 
  let alertClass = type === 'success' ? 'alert-success' : 'alert-danger';

  const alertElement = document.createElement('div');
  alertElement.className = `alert ${alertClass} alert-dismissible fade show`; // Set class based on type parameter
  alertElement.innerHTML = `
    <strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  alertContainer.appendChild(alertElement);

  setTimeout(() => {
    alertElement.remove();
  }, 2000); 
};

  

 // generate nozzle
 const handleGenerateNozzle = () => {
  const name = nozzleName;
  const position = nozzlePosition;
  const length = parseFloat(document.getElementsByName('length')[0].value) || 0; // Assuming nozzle length is a number

  // Check if the nozzle name, position, and length are not empty
  if (name && position && length > 0) {
    const isNameDuplicate = nozzleData.some(
      (nozzle) => nozzle.name === name
    );

    
    if (isNameDuplicate) {
      
      showAlert('Nozzle name is already in use. Please provide a unique nozzle name.', 'error');
      return;
    }

    const isPositionDuplicate = nozzleData.some(
      (nozzle) => nozzle.position === position
    );

    // Check for duplicate nozzle position
    if (isPositionDuplicate) {
      // Show alert for duplicate nozzle position
      showAlert('Position is already in use. Please choose a different position.', 'error');
      return;
    }

    
    const updatedNozzleData = [...nozzleData, { name, position, length }];

    // Clear the canvas
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas

    
    drawExistingElements(context, innerDiameterInMM, heightInMM, rotationAngle, wallThickness, updatedNozzleData);

    
    showAlert('Nozzle generated successfully', 'success');

    
    setNozzleData(updatedNozzleData);
    setNozzleName('');
    setNozzlePosition('');
    setNozzleLength('');
  } else {
    
    showAlert('Please provide all nozzle name, position, and a valid length.', 'error');
  }
};




const drawExistingElements = (context, innerDiameter, height, angle, wallThickness, nozzleData, vesselType) => {
  const centerX = canvasRef.current.width / 2;
  const centerY = canvasRef.current.height / 1.51;

  
    // Draw the cylinder
    drawRotatedCylinder(
      context,
      innerDiameterInMM,
      heightInMM,
      rotationAngle,
      wallThickness,
      nozzleData
    );

    // Draw existing nozzles
    nozzleData.forEach(nozzle => {
      if (orientation === 'vertical') {
      switch (nozzle.position) {
        case 'top':
          drawRectangleOnUpperArc(context, centerX, centerY, outerDiameter, height, innerDiameter, nozzle.length, nozzle.length); // Use nozzle.length for both left and right sides
          break;
        case 'right':
          drawRectangleOnRightSide(context, centerX, centerY, outerDiameter, height, innerDiameter, nozzle.position);
          break;
        case 'left':
          drawRectangleOnLeftSide(context, centerX, centerY, outerDiameter, height, nozzle.position, nozzle.length); // Use nozzle.length as lineLength
          break;
        case 'bottom':
          drawRectangleOnBottomArc(context, centerX, centerY, outerDiameter, height, innerDiameter, nozzle.length, nozzle.length); // Use nozzle.length for both left and right sides
          break;
        default:
          // Handle default case
          break;
      }
      }
    });
  
};









const handleTopRectangleLengthInput = () => {
  // Get the value from the input field
  const userInput = document.querySelector('input[name="length"]').value;
  return parseInt(userInput) || 40; // Default value is 40 if input is invalid or empty
};




const drawRectangleOnUpperArc = (context, centerX, centerY, outerDiameter, height, innerDiameter, lineLengthLeft, lineLengthRight) => {
  // Save the current state
  context.save();

  // Define fixed dimensions for the rectangle
  const rectangleHeight = 18;

  
  const dynamicRectangleWidth = handleTopRectangleLengthInput(); // Get the length from user input

  
  const rectangleX = centerX - dynamicRectangleWidth / 2;
  const rectangleY = centerY - height - outerDiameter / 2 - rectangleHeight;

  
  const arcSurfaceYLeft = centerY - height - Math.sqrt((outerDiameter / 2) ** 2 - ((rectangleX - centerX) ** 2));
  const arcSurfaceYRight = centerY - height - Math.sqrt((outerDiameter / 2) ** 2 - ((rectangleX + dynamicRectangleWidth - centerX) ** 2));

  
  context.beginPath();
  context.moveTo(rectangleX, rectangleY); 
  context.lineTo(rectangleX + dynamicRectangleWidth, rectangleY); 
  context.lineTo(rectangleX + dynamicRectangleWidth, arcSurfaceYRight); 
  context.lineTo(rectangleX, arcSurfaceYLeft); 
  context.closePath(); 
  context.fillStyle = 'white'; 
  context.fill();
  context.stroke();

  // Draw small lines on top of the rectangle
  const smallLineLength = 12; // Length of the small lines
  const halfSmallLineLength = smallLineLength / 2;

  // Draw small line at the top left corner
  context.beginPath();
  context.moveTo(rectangleX - halfSmallLineLength, rectangleY); 
  context.lineTo(rectangleX + halfSmallLineLength, rectangleY); 
  context.stroke();

  // Draw small line at the top right corner
  context.beginPath();
  context.moveTo(rectangleX + dynamicRectangleWidth - halfSmallLineLength, rectangleY); 
  context.lineTo(rectangleX + dynamicRectangleWidth + halfSmallLineLength, rectangleY); 
  context.stroke();

  // Restore the previous state
  context.restore();
};






const drawUpperArc = (context, centerX, centerY, outerDiameter, height, selectedLength) => {
  context.beginPath();
  
  
  // Calculate the angle corresponding to the selected length on the arc
  const angle = Math.acos(1 - (2 * selectedLength) / outerDiameter);
  
  // Calculate the coordinates of the selected point on the arc
  const selectedX = centerX + (outerDiameter / 2) * Math.cos(angle);
  const selectedY = centerY - height + (outerDiameter / 2) * Math.sin(angle);
  
  
  const tangentSlope = -Math.tan(angle);
  
  
  const nozzleLineX1 = selectedX - height / Math.sqrt(1 + tangentSlope ** 2);
  const nozzleLineY1 = selectedY - tangentSlope * height / Math.sqrt(1 + tangentSlope ** 2);
  const nozzleLineX2 = selectedX + height / Math.sqrt(1 + tangentSlope ** 2);
  const nozzleLineY2 = selectedY + tangentSlope * height / Math.sqrt(1 + tangentSlope ** 2);
  
  // Draw the straight lines connecting the nozzle to the arc
  context.moveTo(nozzleLineX1, nozzleLineY1);
  context.lineTo(selectedX, selectedY);
  context.lineTo(nozzleLineX2, nozzleLineY2);
  
  // Draw the arc
  context.arc(centerX, centerY - height, outerDiameter / 2, Math.PI, 0);
  
  // Stroke the path
  context.stroke();
};







  

const drawRectangleOnRightSide = (context, centerX, centerY, outerDiameter, height, innerDiameter, nozzlePosition) => {
 
  const rectangleHeightInput = document.querySelector('input[name="length"]');
  let rectangleHeight = parseInt(rectangleHeightInput.value) || 50; // Default value is 50 if input is invalid or empty

  
  const rectangleWidth = 20;

  // Calculate the position of the rectangle on the right side
  const rectangleX = centerX + outerDiameter / 2;
  const rectangleY = centerY - height / 2;

  // Draw the rectangle
  context.beginPath();
  context.rect(rectangleX, rectangleY - rectangleHeight / 2, rectangleWidth, rectangleHeight);
  context.fillStyle = 'white'; // Set the fill color
  context.fill();
  context.stroke();

  // Draw the extra lines
  const extraLineYStartDown = rectangleY + rectangleHeight / 2; 
  const extraLineYEndDown = extraLineYStartDown + 8; 
  const extraLineYStartUp = rectangleY - rectangleHeight / 2; 
  const extraLineYEndUp = extraLineYStartUp - 8; 
  const lineX = rectangleX + rectangleWidth / 1; 

  // Draw the extra lines
  context.beginPath();
  context.moveTo(lineX, extraLineYStartDown); // Starting point below
  context.lineTo(lineX, extraLineYEndDown); // Ending point below
  context.moveTo(lineX, extraLineYStartUp); // Starting point above
  context.lineTo(lineX, extraLineYEndUp); // Ending point above
  context.stroke();

  console.log('right is selected');
};

    
      

const drawRectangleOnLeftSide = (context, centerX, centerY, outerDiameter, height, nozzlePosition, lineLength) => {
  
  const rectangleHeightInput = document.querySelector('input[name="length"]');
  let rectangleHeight = parseInt(rectangleHeightInput.value) || 50; // Default value is 50 if input is invalid or empty

  const rectangleWidth = 20;

  
  const rectangleX = centerX - outerDiameter / 2 - rectangleWidth - 0;
  const rectangleY = centerY - height / 2;

  // Draw the rectangle
  context.beginPath();
  context.rect(rectangleX, rectangleY - rectangleHeight / 2, rectangleWidth, rectangleHeight);
  context.fillStyle = 'white'; // Set the fill color
  context.fill();
  context.stroke();

  // Draw the extra lines
  const extraLineYStartDown = rectangleY + rectangleHeight / 2; 
  const extraLineYEndDown = extraLineYStartDown + 8;
  const extraLineYStartUp = rectangleY - rectangleHeight / 2; 
  const extraLineYEndUp = extraLineYStartUp - 8;
  const lineX = rectangleX + rectangleWidth / 20 - 1; 

  // Draw the extra lines
  context.beginPath();
  context.moveTo(lineX, extraLineYStartDown); // Starting point below
  context.lineTo(lineX, extraLineYEndDown); // Ending point below
  context.moveTo(lineX, extraLineYStartUp); // Starting point above
  context.lineTo(lineX, extraLineYEndUp); // Ending point above
  context.stroke();

  console.log('left is selected');
};

  

const drawRectangleOnBottomArc = (context, centerX, centerY, outerDiameter, height, innerDiameter, lineLengthLeft, lineLengthRight) => {
  // Define fixed dimensions for the rectangle
  const rectangleHeight = 23;

  // Get the user input for dynamicRectangleWidth
  const dynamicRectangleWidthInput = document.querySelector('input[name="length"]');
  let dynamicRectangleWidth = parseInt(dynamicRectangleWidthInput.value) || 33; // Default width is 33 if input is invalid or empty

  // Calculate the position of the rectangle on the bottom arc
  const rectangleX = centerX - dynamicRectangleWidth / 2;
  const arcSurfaceY = centerY + outerDiameter / 1.55; // Y-coordinate of the bottom arc's outer surface

  // Calculate the y-coordinate of the bottom edge of the rectangle to ensure it connects with the bottom arc
  const rectangleY = arcSurfaceY - rectangleHeight;

  // Draw the rectangle without the bottom line
  context.beginPath();
  context.moveTo(rectangleX, rectangleY); // Starting point at the top left corner of the rectangle
  context.lineTo(rectangleX + dynamicRectangleWidth, rectangleY); // Top side
  context.lineTo(rectangleX + dynamicRectangleWidth, rectangleY + rectangleHeight); // Right side
  context.lineTo(rectangleX, rectangleY + rectangleHeight); // Left side
  context.closePath(); // Close the path
  context.fillStyle = 'white'; // Set the fill color
  context.fill();
  context.stroke();

  // Draw small lines on top of the rectangle
  const smallLineLength = 12; // Length of the small lines
  const halfSmallLineLength = smallLineLength / 2;

  // Draw small line at the top left corner
context.beginPath();
context.moveTo(rectangleX - halfSmallLineLength, rectangleY + rectangleHeight); // Starting point
context.lineTo(rectangleX + halfSmallLineLength, rectangleY + rectangleHeight); // Ending point
context.stroke();

// Draw small line at the bottom right corner
context.beginPath();
context.moveTo(rectangleX + dynamicRectangleWidth - halfSmallLineLength, rectangleY + rectangleHeight); // Starting point
context.lineTo(rectangleX + dynamicRectangleWidth + halfSmallLineLength, rectangleY + rectangleHeight); // Ending point
context.stroke();

};



const drawBottomArc = (context, centerX, centerY, outerDiameter) => {
  context.beginPath();
  context.arc(centerX, centerY, outerDiameter / 2, 0, Math.PI);
  context.stroke();
};




const saveTableDataAsJSON = () => {
  // Prompt the user for the file name
  const fileName = window.prompt("Enter file name (without extension):");
  if (!fileName) {
    // User canceled or entered empty string
    return;
  }

  // Extract nozzle data from the table
  const nozzleData = Array.from(document.querySelectorAll('.table tbody tr')).map(row => ({
    NozzleName: row.cells[0].textContent.trim(),
    Position: row.cells[1].textContent.trim(),
    Length: row.cells[2].textContent.trim(),
  }));

 
  // Prepare the data object
  const dataToSave = {
    generalTabData: {
      InnerDiameter: innerDiameterInMM,
      WallThickness: wallThickness, 
      Height: heightInMM,
      DiameterOuter: outerDiameter,
      Type: orientation,
      VesselTag: VesselTag,
      Description: Description
    },
    nozzleTabData: nozzleData
    // Add more data as needed
  };

  // Convert the data object to JSON
  const jsonData = JSON.stringify(dataToSave);

  const blob = new Blob([jsonData], { type: 'application/json' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.json`; 
  document.body.appendChild(link);

  // download the file
  link.click();

  // Clean up by revoking the URL
  URL.revokeObjectURL(url);
};


const handleDefaultZoom = () => {
  // Set the default zoom value
  setZoom(1);
};

  
  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 1.1); 
  };
  
  const handleZoomOut = () => {
    setZoom((prevZoom) => prevZoom / 1.1); 
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      try {
        const jsonData = JSON.parse(content);
        // General and Nozzle tabs
        setUploadedData(jsonData);
        setInnerDiameterInMM(jsonData.generalTabData.InnerDiameter);
        setWallThickness(jsonData.generalTabData.WallThickness);
        setHeightInMM(jsonData.generalTabData.Height);
        setOuterDiameter(jsonData.generalTabData.DiameterOuter);
        setOrientation(jsonData.generalTabData.Type);
        setNozzleData(jsonData.nozzleTabData); 
        
        // Example:
        if (jsonData.nozzleTabData.length > 0) {
          const firstNozzle = jsonData.nozzleTabData[0];
          setNozzleName(firstNozzle.NozzleName);
          setNozzlePosition(firstNozzle.Position);
          setNozzleLength(firstNozzle.Length);
        }
        
        setTimeout(() => {
          handleGenerate();
          
        }, 2000);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
  };
  
  const setVesselTagValue = (newValue) => {
    setVesselTag(newValue);
  };
  const setDescriptionvalue = (newValue) => {
    setDescription(newValue);
  };

  const deleteNozzle = (index,context) => {
    if (index < 0 || index >= nozzleData.length) {
        console.error("Invalid index:", index);
        return;
    }

    const nozzleToRemove = nozzleData[index];
    
    
    if (['top', 'left', 'right'].includes(nozzleToRemove.position)) {
        
        const updatedNozzleData = [...nozzleData];
        updatedNozzleData.splice(index, 1);
        setNozzleData(updatedNozzleData);

        
        
    } else {
       
        console.log("Nozzle is not at the top, left, or right position.");
    }
};




const switchToGeneralTab = () => {
  setShowGeneral(true);
};


const switchToNozzleTab = () => {
  setShowGeneral(false);
};

const clearTableData = () => {
  setNozzleData([]); 
};


const handleGenerateCylinder = () => {
  
  if (activeTab === 'General') {
    clearTableData();
  }

  
};

  return (
    
    <> 
    <div  id="alertContainer" style={{  zIndex: '10000', textAlign: 'center' }}>
    <nav  className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#ff0000 !important', }}>
    
  <a className="navbar-brand" href="#" >
    <b  style={{ fontSize: '39px', marginLeft: '100px' }}>Vessel Designing Tool</b>
  </a>
  
  {/* Button */}
  <button
    className='btn btn-success'
    type="button"
    
    style={{
      paddingTop: '8px',
      backgroundColor: '',
      hoverable: 'backgroundcolor:green',
      textAlign: 'center',
      textDecoration: 'none',
      marginLeft: '10px',
      fontSize: '16px',
      margintop: '50px',
      marginRight: '10px',
      marginBottom: '4px',
      marginLeft: '65px'
    }}
    onClick={() => {
      switchToNozzleTab(); 
      setTimeout(() => {
        saveTableDataAsJSON(); 
      }, 500);
    }}
  >
    Save Data
  </button>
  
  {/* File Input */}
  <input 
    type="file" 
    className="form-control-file" 
    style={{
      paddingLeft:'10px',
      color: '#444',
      padding: '3px',
      background: '#fff',
      borderRadius: '10px',
      border: '1px solid #555',
      marginBottom: '5px'
    }} 
    onChange={handleFileUpload} 
    accept=".json" 
    onClick={switchToNozzleTab} // Call switchToNozzleTab before file upload
  />
  
  <a href="https://www.linde.com/" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '100px' }}>
    <img src={signImage} alt="Logo" style={{ width: '210px', height: '50px', marginLeft: '', marginRight: 'auto', cursor: 'pointer' }} />
  </a>
</nav>
</div>

    
  <div  style={{ className:"container-fluid" ,display: 'flex', justifyContent: 'space-between', padding: '5px', paddingRight: '20px', backgroundColor: '#FAFFFF', marginTop: '',maxHeight: 'calc(100vh - 100px)',id:'alertContainer' }}>
  
      <div   style={{ className:"row", display: 'flex', justifyContent: 'space-between', padding: '20px', backgroundColor: 'white', flexWrap: 'wrap', marginTop: ''}}>
      
        <div  style={{className:"col-md-8" ,flexWrap: 'nowrap' }}>
          <ul style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }} className="nav nav-tabs">
            <li className="nav-item">
            <button
            className={`nav-link ${showGeneral ? 'active' : ''}`}
            onClick={switchToGeneralTab}
          >
            General
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${!showGeneral ? 'active' : ''}`}
            onClick={switchToNozzleTab}
          >
          Nozzle </button>
            </li>
          </ul>
        </div>
        <div  style={{ float: '', justifyContent: 'space-between', padding: '60px', marginRight: '18px',paddingBottom:'50px' }}>
        {showGeneral &&  (
            <div className="form-group">
              <label style={{ float: 'left', marginRight: '10px' }}>Inner Diameter (mm):</label>
              <input className="form-control" id='Inner_Diameter' type="number" min="10" max="" style={{ height: '22px', marginRight: '50px' }} value={uploadedData ?uploadedData.generalTabData.InnerDiameter :innerDiameterInMM} onChange={handleInnerDiameterChange} />
              
              <label style={{ float: 'left', marginRight: '10px' }}>Wall Thickness (mm):</label>
              <input  className="form-control" id='Wall_Thickness' style={{ height: '22px', marginRight: '50px' }} type="number" min="1" max="" value={uploadedData ?uploadedData.generalTabData.WallThickness:wallThickness} onChange={handleWallThicknessChange} />
              
              <label style={{ float: 'left', marginRight: '10px' }}>Height(mm):</label>
              <input  className="form-control" id='Height' style={{ height: '22px', minWidth: '3px', fontSize: '14pt', paddingLeft: '5px', paddingRight: 'px', marginRight: '100px' }} type="number" min="1" max="" value={uploadedData ?uploadedData.generalTabData.Height:heightInMM} onChange={handleHeightChange}></input>
              
              <label style={{ float: 'left', marginRight: '10px' }}>Diameter Outer(mm):</label>
              <input className="form-control" id='Diameter_Outer' style={{ minWidth: '225px', fontWeight: '', height: '22px', marginRight: '100px' }} type="number" min="10" max="300" value={uploadedData ?uploadedData.generalTabData.DiameterOuter:outerDiameter} readOnly />
              
              <label style={{ float: 'left', marginRight: '10px' }}>Vessel Tag No.:</label>
              <input className="form-control" id='Vessel_tag' type="string" min="10" value={uploadedData ?uploadedData.generalTabData.VesselTag :VesselTag} onChange={(e) => setVesselTagValue(e.target.value)}  style={{ height: '22px', marginRight: '50px' }} />

              <label style={{ float: 'left', marginRight: '10px' }}>Description:</label>
              <input className="form-control" id='Description' type="string" min="10" onChange={(e) => setDescriptionvalue(e.target.value)} value={uploadedData ?uploadedData.generalTabData.Description :Description}  style={{ height: '22px', marginRight: '50px' }} />

              <label style={{ float: 'left', height: '', fontSize: '14pt', marginRight: '10px' }}>Type:</label>
<select
  className="form-control"

  id="orientation"
  value={uploadedData ? uploadedData.generalTabData.Type : orientation}
  onChange={rotation}
  style={{ height: '35px', minWidth: '', fontWeight: '', marginRight: '' }}
>
  <option value="horizontal" id='Horizontal'>Horizontal</option>  
  <option value="vertical" id='Vertical'>Vertical</option>
</select>
              <br/>
              <div style={{ marginRight: '100px' }}>
              <button
  className='btn btn-success'
  type="button"
  style={{
    backgroundColor: '',
    hoverable: 'backgroundcolor:green',
    textAlign: 'center',
    textDecoration: 'none',
  }}
  onClick={() => {
    handleGenerate();
    handleGenerateCylinder();
  }}
>
  Generate Vessel
</button>
              </div>
            </div>
          )}
          {!showGeneral && (
            <div  className="form-group" style={{marginBottom:'70px',marginLeft:'0px'}}>
            
              <label style={{ float: 'left', marginRight: '10px' }}>Nozzle Name</label> 
              <input name="nozzleField1" id='Nozzle Name' className="form-control" type="text" min="10" max="" style={{ height: '22px', marginRight: '0px' }} value={nozzleName} onChange={(e) => setNozzleName(e.target.value)} />          
  
              <label style={{ float: 'left', marginRight: '10px' }}>Length:</label> 
              <input name="length" value={NozzleLength}  className="form-control" id='Length' type="number" min="10" max="" style={{ height: '22px', marginRight: '0px' }} onChange={(e) => setNozzleLength(e.target.value)  } />
              
              <label style={{ float: 'left', height: '', fontSize: '14pt', marginRight: '10px' }}>Position:</label>
              <select id='Position' className="form-control" name="nozzleField2" value={nozzlePosition} onChange={(e) => setNozzlePosition(e.target.value)} style={{ height: '35px', minWidth: '', fontWeight: '', marginRight: '' }}>
                <option value="select">Select</option>
                <option value="top">Top</option>
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="bottom">Bottom</option>
              </select>
              &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <br />
              <button
                className="btn btn-success"
                type="button"
                style={{
                  paddingTop:'10px',
                  backgroundColor: '',
                  hoverable: 'backgroundcolor:green',
                  margintop: '22px',
                  paddingtop: '12px',
                  marginRight: '120px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '16px',
                }}
                onClick={handleGenerateNozzle}
                disabled={nozzlePosition === 'Select'}
              >
                {activeTab === '' ? 'Generate nozzle/Cylinder' : 'Generate Nozzle'}
              </button> 
              
                
              {nozzlePosition !== 'Select' && (
                <div style={{ marginRight: '100px', marginTop: '0px' }}>
      <table className="table" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th scope="col">Nozzle Name</th>
            <th scope="col">Position</th>
            <th scope="col">Length</th>
            {/* Add a column for actions */}
          </tr>
        </thead>
        <tbody>
          {nozzleData.map((nozzle, index) => (
            <tr key={index}>
              <td>{nozzle.name}</td>
              <td>{nozzle.position}</td>
              <td>{nozzle.length}</td>
              <td>
                <FontAwesomeIcon icon={faTrash} onClick={() => deleteNozzle(index)} style={{ cursor: 'pointer' }} />
              </td> {/* Render the delete icon and pass the deleteNozzle function with the index */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

              )}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white',flexdirection:'row',flexWrap:'wrap',border: '1px solid #000' }}>

        <FontAwesomeIcon icon={faSearchPlus} onClick={handleZoomIn} style={{ cursor: 'pointer', marginRight: '5px' }} />

        <FontAwesomeIcon icon={faUndo} onClick={handleDefaultZoom} />

        <FontAwesomeIcon icon={faSearchMinus} onClick={handleZoomOut} style={{ cursor: 'pointer' }} />

        <canvas
          ref={canvasRef} width="750" height="620"  style={{ border: 'none',transform: `scale(${zoom})`, transformOrigin: '50% 0' }}
        />
      </div>
    </div>
    <div style={{ textAlign: 'center', marginTop: '36px', color: '#555', fontSize: '12px', marginBottom: '' }}>
      <b> &copy; {new Date().getFullYear()} Linde Engineering. All Rights Reserved. </b>
    </div>
    <div id="linkForm" style={{ display: 'none', justifyContent: 'space-between', padding: '20px', backgroundColor: '#5bb1cd', marginTop: '' }}>
      {/* Link form content */}
    </div>
    
  </>

  
  );
};


export default Cylinder;