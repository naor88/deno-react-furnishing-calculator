import React, { useEffect, useState } from "react";
import "./App.css";
import Closet3DView from "./Closet3DView.tsx";

const App: React.FC = () => {
  const [closetWidth, setClosetWidth] = useState<number | string>("180");
  const [closetHeight, setClosetHeight] = useState<number | string>("240");
  const [closetDepth, setClosetDepth] = useState<number | string>("60");
  const [numOfShelves, setNumOfShelves] = useState<number | string>("10");
  const [bufferWidth, setBufferWidth] = useState<number | string>("0.17");
  const [doorNumbers, setDoorNumbers] = useState<number | string>("3"); // ערך ברירת מחדל הוא 3
  const [numShelves, setNumShelves] = useState(5);
  const [structureColor, setStructureColor] = useState("#8B4513"); // SaddleBrown
  const [doorColor, setDoorColor] = useState("rgba(255, 0, 0, 0.5)"); // White
  const [opacity, setOpacity] = useState(0.5); // Default opacity (1 = fully opaque)
  const [shelfColor, setShelfColor] = useState("#D2B48C"); // Tan
  const [language, setLanguage] = useState<'en'|'he'>("he"); // הוספת בחירת שפה

  useEffect(() => {
    // Update the dir attribute on the body element whenever the language changes
    document.body.setAttribute("dir", getDirection(language));
  }, [language]);

  const translations = {
    en: {
      closetWidth: "Closet Width",
      closetHeight: "Closet Height",
      closetDepth: "Closet Depth",
      shelfCount: "Number of Shelves",
      bufferWidth: "Buffer Width",
      doorNumbers: "Number of Doors",
      doorWidth: "Door Width",
      doorHeight: "Door Height",
      internalBeamHeight: "Internal Beam Height",
      shelfWidth: "Shelf Width",
      shelfHeight: "Shelf Height",
      shelfDepth: "Shelf Depth",
      formulas: "Formulas",
      calculationResults: "Closet Calculation Results",
      externalBeams: "External Beams (Height 240cm)",
      internalBeams: "Internal Beams",
      cm: "cm",
    },
    he: {
      closetWidth: "רוחב ארון",
      closetHeight: "גובה ארון",
      closetDepth: "עומק ארון",
      shelfCount: "מספר מדפים",
      bufferWidth: "רוחב מרווח",
      doorNumbers: "מספר דלתות",
      doorWidth: "רוחב דלת",
      doorHeight: "גובה דלת",
      internalBeamHeight: "גובה קורה פנימית",
      shelfWidth: "רוחב מדף",
      shelfHeight: "גובה מדף",
      shelfDepth: "עומק מדף",
      formulas: "נוסחאות",
      calculationResults: "ארון - תוצאות חישוב",
      externalBeams: 'קורות חיצוניות (גובה 240 ס"מ)',
      internalBeams: "קורות פנימיות",
      cm: 'ס"מ',
    },
  };

  const t = translations[language];

  // פונקציה לחישוב רוחב הדלת
  const calculateDoorWidth = () => {
    if (closetWidth && bufferWidth && doorNumbers) {
      const closetWidthNum = Number(closetWidth);
      const bufferWidthNum = Number(bufferWidth);
      const doorNumbersNum = Number(doorNumbers);

      const intermediateResult = closetWidthNum - 2 * bufferWidthNum;
      const result = intermediateResult / doorNumbersNum;

      const progress = `(${closetWidthNum} - 2 * ${bufferWidthNum}) / ${doorNumbersNum} = ${intermediateResult.toFixed(
        2
      )} / ${doorNumbersNum} = ${result.toFixed(2)}`;

      return {
        value: result.toFixed(2),
        progress: progress,
      };
    }
    return { value: "", progress: "" };
  };

  // פונקציה לחישוב גובה קורה פנימית
  const calculateInternalBeamHeight = () => {
    if (closetHeight) {
      const closetHeightNum = Number(closetHeight);
      const result = closetHeightNum - 2 * 1.7; // Assuming 17mm = 1.7cm
      return {
        value: result.toFixed(2),
        progress: `${closetHeightNum} - 2 * 1.7 = ${result.toFixed(2)}`,
      };
    }
    return { value: "", progress: "" };
  };

  // פונקציה לחישוב גובה הדלת
  const calculateDoorHeight = () => {
    if (closetHeight) {
      const closetHeightNum = Number(closetHeight);
      const result = closetHeightNum - 1.7 * 2; // Subtracting the thickness of top and bottom panels (1.7cm each)
      return {
        value: result.toFixed(2),
        progress: `${closetHeightNum} - 1.7 * 2 = ${result.toFixed(2)}`,
      };
    }
    return { value: "", progress: "" };
  };

  // פונקציה לחישוב מידות המדפים
  const calculateShelfDimensions = () => {
    if (closetWidth && closetHeight && closetDepth && numOfShelves) {
      const closetWidthNum = Number(closetWidth);
      const closetHeightNum = Number(closetHeight);
      const closetDepthNum = Number(closetDepth);
      const numOfShelvesNum = Number(numOfShelves);
      const bufferWidthNum = Number(bufferWidth);

      const shelfWidth =
        (closetWidthNum - 2 * bufferWidthNum) / numOfShelvesNum;
      const shelfHeight = closetHeightNum / numOfShelvesNum;
      const shelfDepth = closetDepthNum;

      return {
        shelfWidth: {
          value: shelfWidth.toFixed(2),
          progress: `(${closetWidthNum} - 2 * ${bufferWidthNum}) / ${numOfShelvesNum} = ${shelfWidth.toFixed(
            2
          )}`,
        },
        shelfHeight: {
          value: shelfHeight.toFixed(2),
          progress: `${closetHeightNum} / ${numOfShelvesNum} = ${shelfHeight.toFixed(
            2
          )}`,
        },
        shelfDepth: {
          value: shelfDepth.toFixed(2),
          progress: `${closetDepthNum}`,
        },
      };
    }
    return {
      shelfWidth: { value: "", progress: "" },
      shelfHeight: { value: "", progress: "" },
      shelfDepth: { value: "", progress: "" },
    };
  };

  // חישוב קורות חיצוניות
  const calculateExternalBeams = () => {
    return 2; // תמיד צריך 2 קורות חיצוניות בגובה 240 ס"מ
  };

  // חישוב קורות פנימיות
  const calculateInternalBeams = () => {
    return 2; // תמיד צריך 2 קורות פנימיות כאשר יש 3 דלתות
  };

  const getDirection = (lang: string) => {
    return lang === "he" || lang === "ar" ? "rtl" : "ltr";
  };

  const rgbaColor = () => {
    const r = parseInt(doorColor.slice(1, 3), 16);
    const g = parseInt(doorColor.slice(3, 5), 16);
    const b = parseInt(doorColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // שליפת התוצאות של החישובים
  const doorWidth = calculateDoorWidth();
  const doorHeight = calculateDoorHeight();
  const internalBeamHeight = calculateInternalBeamHeight();
  const { shelfWidth, shelfHeight, shelfDepth } = calculateShelfDimensions();
  const externalBeams = calculateExternalBeams();
  const internalBeams = calculateInternalBeams();

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(parseFloat(e.target.value));
  };

  return (
    <div className="App" dir={getDirection(language)}>
      <h1>{t.calculationResults}</h1>
      <div>
        <label>
          {t.closetWidth} ({t.cm}):
          <input
            type="number"
            value={closetWidth}
            onChange={(e) => setClosetWidth(e.target.value)}
          />
        </label>
        <label>
          {t.closetHeight} ({t.cm}):
          <input
            type="number"
            value={closetHeight}
            onChange={(e) => setClosetHeight(e.target.value)}
          />
        </label>
        <label>
          {t.closetDepth} ({t.cm}):
          <input
            type="number"
            value={closetDepth}
            onChange={(e) => setClosetDepth(e.target.value)}
          />
        </label>
        <label>
          {t.shelfCount}:
          <input
            type="number"
            value={numOfShelves}
            onChange={(e) => setNumOfShelves(e.target.value)}
          />
        </label>
        <label>
          {t.bufferWidth} ({t.cm}):
          <input
            type="number"
            value={bufferWidth}
            onChange={(e) => setBufferWidth(e.target.value)}
          />
        </label>
        <label>
          {t.doorNumbers}:
          <input
            type="number"
            value={doorNumbers}
            onChange={(e) => setDoorNumbers(e.target.value)}
            min="1"
          />
        </label>
        <label>
          {t.shelfCount}:
          <input
            type="number"
            value={numShelves}
            onChange={(e) => setNumShelves(parseInt(e.target.value))}
            min={0}
            max={10}
          />
        </label>
      </div>
      <div className="color-inputs">
        <h2>Colors</h2>
        <label>
          Structure Color:
          <input
            type="color"
            value={structureColor}
            onChange={(e) => setStructureColor(e.target.value)}
          />
        </label>
        <label>
          Door Color:
          <input
            type="color"
            value={doorColor}
            onChange={(e) => setDoorColor(e.target.value)}
          />
        </label>
        <label>Opacity:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={handleOpacityChange}
        />
        <label>
          Shelf Color:
          <input
            type="color"
            value={shelfColor}
            onChange={(e) => setShelfColor(e.target.value)}
          />
        </label>
      </div>
      <div>
        <h3>
          {t.formulas} + {t.calculationResults}
        </h3>
        <p>
          {t.doorWidth} : ({t.closetWidth} - 2 * {t.bufferWidth}) /{" "}
          {t.doorNumbers} = {doorWidth.progress} = {doorWidth.value} {t.cm}
        </p>
        <p>
          {t.doorHeight} : {doorHeight.progress} = {doorHeight.value} {t.cm}
        </p>
        <p>
          {t.internalBeamHeight} : {internalBeamHeight.progress} ={" "}
          {internalBeamHeight.value} {t.cm}
        </p>
        <p>
          {t.shelfWidth} : ({t.closetWidth} - 2 * {t.bufferWidth}) /{" "}
          {t.shelfCount} = {shelfWidth.progress} = {shelfWidth.value} {t.cm}
        </p>
        <p>
          {t.shelfHeight} : {t.closetHeight} / {t.shelfCount} ={" "}
          {shelfHeight.progress} = {shelfHeight.value} {t.cm}
        </p>
        <p>
          {t.shelfDepth} : {t.closetDepth} = {shelfDepth.progress} ={" "}
          {shelfDepth.value} {t.cm}
        </p>
        <p>
          {t.externalBeams}: {externalBeams}
        </p>
        <p>
          {t.internalBeams}: {internalBeams}
        </p>
      </div>
      <div>
        <label>Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value as 'en')}>
          <option value="he">עברית</option>
          <option value="en">English</option>
        </select>
      </div>
      <Closet3DView
        width={+closetWidth}
        height={+closetHeight}
        depth={+closetDepth}
        numDoors={+doorNumbers}
        numShelves={numShelves}
        structureColor={structureColor}
        doorColor={doorColor}
        shelfColor={shelfColor}
      />
    </div>
  );
};

export default App;
