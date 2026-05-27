const fs = require('fs');

const file = 'src/components/modules/ShareMenu.tsx';
let content = fs.readFileSync(file, 'utf8');

const importRegex = /import \{ generateProfessionalPDF, .* \} from "\.\.\/\.\.\/utils\/pdfGenerator";/;
content = content.replace(importRegex, "import { GlobalReportEngine } from '../../utils/GlobalReportEngine';\nimport { formatTitleCase, formatCapitalize, filterValidParameters } from '../../utils/pdfGenerator';");

const generatePDFRegex = /const generatePDF = async \([\s\S]*?const generateExcel = async \(\) => \{/m;
const newGeneratePDF = `  const getBoqData = () => {
    const boqData: any[] = [];
    let chartData: any[] = [];
    let grandTotal = 0;
    
    const rates: any = (exportFormat as any)?.rates || {};
    const customTableData = exportFormat?.customTableData;
    const cItem = exportFormat?.cartItem as any;
    
    if (customTableData) {
      customTableData.forEach((row) => {
        boqData.push({
          category: "",
          itemDescription: row.item,
          quantity: typeof row.quantityStr === 'string' ? parseFloat(row.quantityStr) || 0 : row.quantityStr,
          unit: row.unitStr,
          rate: typeof row.rate === 'string' ? parseFloat(row.rate) || 0 : (row.rate || 0),
          amount: row.cost
        });
        grandTotal += row.cost;
        chartData.push({ label: row.item, value: row.cost, color: row.color || "#3B82F6" });
      });
    } else if (cItem) {
      const isSI = cItem.unitVol === "m³";
      
      const addRow = (item: string, qty: number, unitLabel: string, typeRateId: string) => {
        if (qty > 0) {
          const rate = rates[typeRateId] || 0;
          const cost = qty * rate;
          boqData.push({
            category: "",
            itemDescription: item,
            quantity: qty,
            unit: unitLabel,
            rate: rate,
            amount: cost
          });
          grandTotal += cost;
          let color = "#cbd5e1";
          if (item.includes("Cement")) color = "#60a5fa";
          else if (item.includes("Sand")) color = "#fbbf24";
          else if (item.includes("Aggregate")) color = "#94a3b8";
          else if (item.includes("Water")) color = "#22d3ee";
          else if (item.includes("Steel")) color = "#818cf8";
          else if (item.includes("Brick")) color = "#f43f5e";
          else if (item.includes("Block")) color = "#fb923c";
          chartData.push({ label: item, value: cost, color });
        }
      };
      
      addRow("Cement", cItem.cementBags || 0, "Bag", "cement");
      addRow("Sand", cItem.sandVol || 0, cItem.unitVol, "sand");
      addRow("Aggregate", cItem.aggregateVol || 0, cItem.unitVol, "aggregate");
      addRow("Water", isSI ? (cItem.waterLiters || 0) : ((cItem.waterLiters / 3.78541) || 0), isSI ? "L" : "Gal", "water");
      if (cItem.steelKg) addRow("Steel", cItem.steelKg, "kg", "steel");
      if (cItem.bricksCount) addRow("Bricks", cItem.bricksCount, "nos", "bricks");
      if (cItem.blocksCount) addRow("Blocks", cItem.blocksCount, "nos", "blocks");
    } else {
      Object.entries(exportFormat?.breakdown || data).forEach(([k, v]) => {
        const vLower = String(v).toLowerCase();
        let cost = 0;
        let rate = 0;
        let inferredKey = k.toLowerCase();
        
        if (inferredKey.includes("cement")) inferredKey = "cement";
        else if (inferredKey.includes("sand")) inferredKey = "sand";
        else if (inferredKey.includes("aggregate") || inferredKey.includes("crush")) inferredKey = "aggregate";
        else if (inferredKey.includes("water")) inferredKey = "water";
        else if (inferredKey.includes("steel")) inferredKey = "steel";
        else if (inferredKey.includes("brick")) inferredKey = "bricks";
        else if (inferredKey.includes("block")) inferredKey = "blocks";

        if (rates && rates[inferredKey]) {
          const rawNum = parseFloat(vLower.replace(/[^0-9.-]+/g, "")) || 0;
          rate = rates[inferredKey];
          cost = rawNum * rate;
        }

        const qty = parseFloat(String(v)) || 0;
        boqData.push({
          category: "",
          itemDescription: k,
          quantity: qty,
          unit: "",
          rate: rate,
          amount: cost
        });
        
        if (cost > 0) {
          grandTotal += cost;
          chartData.push({ label: k, value: cost });
        }
      });
    }

    const barData = [...chartData].sort((a,b) => b.value - a.value).slice(0, 5);
    return { boqData, chartData, barData, grandTotal };
  };

  const getReportPayload = () => {
    const { boqData, chartData, barData, grandTotal } = getBoqData();
    const cleanInputs = filterValidParameters(exportFormat?.inputs || {});
    const coveredAreaObj = cleanInputs["Covered Area"] || cleanInputs["Plot Area"];
    const coveredArea = typeof coveredAreaObj === 'string' ? parseFloat(coveredAreaObj.replace(/[^\\d.-]/g, '')) : (coveredAreaObj || 0);
    
    return {
      toolName: title,
      metadata: {
        totalEstimatedCost: grandTotal,
        costPerSqFt: coveredArea > 0 ? (grandTotal / coveredArea) : undefined,
        totalCoveredArea: coveredArea > 0 ? coveredArea : undefined,
        structureType: cleanInputs["Structure Type"] || "Standard",
        ...cleanInputs
      },
      chartData: {
        donut: chartData,
        bar: barData
      },
      boqData
    };
  };

  const generatePDF = async (
    exportType: "pdf" | "whatsapp" | "email" = "pdf",
  ) => {
    try {
      const payload = getReportPayload();
      const doc = await GlobalReportEngine.generatePDF(payload);

      const fileName = \`\${getFileNamePrefix()}.pdf\`;
      if (exportType === "whatsapp" || exportType === "email") {
        const pdfBlob = doc.output("blob");
        const file = new File([pdfBlob], fileName, { type: "application/pdf" });
        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          await navigator.share({
            title: title,
            text: "Here is the estimation PDF generated via Civil Estimation Pro.",
            files: [file],
          });
          toast.success("Shared successfully");
          setIsOpen(false);
        } else {
          toast(
            \`Direct file sharing via \${exportType} is not supported. The PDF will be downloaded.\`,
            { icon: "ℹ️" },
          );
          doc.save(fileName);
          setIsOpen(false);
          toast.success(\`✅ File saved as \${fileName}\`);
        }
      } else {
        doc.save(fileName);
        setIsOpen(false);
        toast.success(\`✅ File saved as \${fileName}\`);
      }
    } catch(e) {
      console.error(e);
      toast.error('Failed to generate PDF');
    }
  };

  const generateExcel = async () => {`;

content = content.replace(generatePDFRegex, newGeneratePDF);

const excelRegex = /const generateExcel = async \(\) => \{[\s\S]*?toast\.success\(\`✅ File saved as \$\{fileName\}\`\);\n  \};/m;
const newExcel = `const generateExcel = async () => {
    try {
      const payload = getReportPayload();
      const workbook = await GlobalReportEngine.generateExcel(payload);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const fileName = \`\${getFileNamePrefix()}.xlsx\`;
      saveAs(blob, fileName);
      setIsOpen(false);
      toast.success(\`✅ File saved as \${fileName}\`);
    } catch(e) {
      console.error(e);
      toast.error('Failed to generate Excel file');
    }
  };`;

content = content.replace(excelRegex, newExcel);

fs.writeFileSync(file, content);
