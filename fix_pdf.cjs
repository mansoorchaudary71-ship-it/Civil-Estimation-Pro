const fs = require('fs');
const file = 'src/utils/GlobalReportEngine.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /\s*\/\/ 2\. Project Parameters Grid[\s\S]*?\/\/ 4\. Data Visualizations/m;

const newGen = `

    // 2. 3D Hero Graphic Placeholder & Project Parameters
    let currentY = 55;

    // Hero Placeholder
    doc.setFillColor(241, 245, 249); // slate-100
    doc.roundedRect(14, currentY, 70, 60, 2, 2, "F");
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.roundedRect(14, currentY, 70, 60, 2, 2, "S");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("3D Hero Graphic", 49, currentY + 28, { align: "center" });
    doc.text("Placeholder", 49, currentY + 34, { align: "center" });

    // Project Parameters Grid (Right-Aligned next to Hero)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("Project Parameters", 90, currentY + 4);

    const ignoreKeys = ['totalEstimatedCost', 'costPerSqFt', 'totalCoveredArea', 'structureType', 'projectName', 'date', 'contingency', 'gst', 'totalCost'];
    const paramsMap = [];
    
    if (safeData.metadata.projectName) paramsMap.push({ label: "Project Name", value: safeData.metadata.projectName });
    if (safeData.metadata.clientName) paramsMap.push({ label: "Client Name", value: safeData.metadata.clientName });
    if (safeData.metadata.structureType) paramsMap.push({ label: "Structure Type", value: safeData.metadata.structureType });
    if (safeData.metadata.totalCoveredArea) paramsMap.push({ label: "Covered Area", value: safeData.metadata.totalCoveredArea + " sq.ft" });
    
    Object.keys(safeData.metadata).forEach(k => {
      if (!ignoreKeys.includes(k) && safeData.metadata[k] !== undefined) {
         const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
         paramsMap.push({ label, value: safeData.metadata[k] });
      }
    });

    const paramColWidth = (pageWidth - 90 - 14) / 2;
    let paramGridY = currentY + 12;
    paramsMap.forEach((param, index) => {
       const col = index % 2;
       const row = Math.floor(index / 2);
       const yPos = paramGridY + (row * 12);
       if (yPos > currentY + 55) return; // limit rows safely
       
       doc.setFont("helvetica", "bold");
       doc.setFontSize(8);
       doc.setTextColor(100, 116, 139); // slate-500
       doc.text(param.label.toUpperCase(), 90 + (col * paramColWidth), yPos);
       
       doc.setFont("helvetica", "bold");
       doc.setFontSize(10);
       doc.setTextColor(15, 23, 42); // slate-900
       
       // Handle long strings
       let strVal = String(param.value);
       if (strVal.length > 25) strVal = strVal.substring(0, 22) + "...";
       doc.text(strVal, 90 + (col * paramColWidth), yPos + 5);
    });

    currentY += 70;

    // 3. Executive Summary text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Executive Summary", 14, currentY);
    currentY += 6;

    let highestDriver = "materials";
    let highestPct = "0.0";
    if (safeData.chartData?.donut?.length > 0) {
      const sorted = [...safeData.chartData.donut].sort((a,b) => b.value - a.value);
      highestDriver = sorted[0].label;
      const total = safeData.metadata.totalEstimatedCost || sorted.reduce((sum, d) => sum + d.value, 0);
      if (total > 0) highestPct = ((sorted[0].value / total) * 100).toFixed(1);
    }
    
    const summaryText = \`This estimate is prepared for a \${safeData.metadata.totalCoveredArea || 'custom'} sq.ft \${safeData.metadata.structureType || safeData.toolName.toLowerCase()}. The total estimated budget is Rs \${Math.round(safeData.metadata.totalEstimatedCost || 0).toLocaleString()}. The primary cost driver is \${highestDriver}, accounting for \${highestPct}% of the overall budget.\`;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    
    const splitText = doc.splitTextToSize(summaryText, pageWidth - 28);
    doc.text(splitText, 14, currentY);
    currentY += (splitText.length * 4) + 6;

    // 4 Premium KPI Cards
    const numCards = 4;
    const cardGap = 4;
    const availableWidth = pageWidth - 28;
    const cardWidth = (availableWidth - (cardGap * (numCards - 1))) / numCards;
    
    const drawKpiCard = (idx, title, value) => {
      const x = 14 + (idx * (cardWidth + cardGap));
      
      // Shadow layer
      doc.setFillColor(226, 232, 240); // slate-200
      doc.roundedRect(x + 1, currentY + 1, cardWidth, 20, 1.5, 1.5, "F");
      
      // Card body
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(x, currentY, cardWidth, 20, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(title, x + (cardWidth / 2), currentY + 7, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      
      let finalVal = value;
      if (finalVal.length > 15) finalVal = finalVal.substring(0, 14) + "..";
      doc.text(finalVal, x + (cardWidth / 2), currentY + 14, { align: "center" });
    };

    drawKpiCard(0, "GRAND TOTAL", \`Rs \${Math.round(safeData.metadata.totalEstimatedCost || 0).toLocaleString()}\`);
    drawKpiCard(1, "COST PER SQ.FT", safeData.metadata.costPerSqFt ? \`Rs \${Math.round(safeData.metadata.costPerSqFt).toLocaleString()}\` : "N/A");
    drawKpiCard(2, "BUILT-UP AREA", safeData.metadata.totalCoveredArea ? \`\${safeData.metadata.totalCoveredArea} sq.ft\` : "N/A");
    drawKpiCard(3, "MAIN COST DRIVER", highestDriver);

    currentY += 28;

    // 4. Data Visualizations`;

content = content.replace(regex, newGen);

fs.writeFileSync(file, content);
