// Set line width
C.lineWidth = 10;

// Wall
C.strokeRect(75, 140, 150, 110);

// Door
C.fillRect(130, 190, 40, 60);

// Roof
C.beginPath();
C.moveTo(50, 140);
C.lineTo(150, 60);
C.lineTo(250, 140);
C.closePath();
C.stroke();