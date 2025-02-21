import { useState, useEffect } from "react"

import ErrorAlert from "./ErrorAlert"; import { source } from "framer-motion/client";
;


function Chat({ output }) {

    const [error, setError] = useState("");
    const [languageDetected, setLanguageDetected] = useState({ sourcelang: "", LangName: "" });

    const languageMap = {
        "en": "English",
        "ru": "Russian",
        "fr": "French",
        "es": "Spanish",
        "de": "German",
        "zh": "Chinese",
        "ja": "Japanese",
        "ar": "Arabic",
        "hi": "Hindi",
        "pt": "Portuguese",
        "it": "Italian",
        "nl": "Dutch",
        "ko": "Korean",
        "tr": "Turkish",
        "pl": "Polish",
        "sv": "Swedish",
        "uk": "Ukrainian",
        "la": "Latin"
    };

    const getLanguageName = (langCode) => languageMap[langCode] || "Unknown Language";

    const detectLanguage = () => {

        (async () => {
            const languageDetectorCapabilities = await self.ai.languageDetector.capabilities();
            const canDetect = languageDetectorCapabilities.available;
            let detector;
            if (canDetect === 'no') {
                setError("The language detector isn't usable.")
                return;
            }
            if (canDetect === 'readily') {
                // The language detector can immediately be used.
                detector = await self.ai.languageDetector.create();

                const results = await detector.detect(output);

                // console.log(results[0]);

                setLanguageDetected({ sourcelang: results[0].detectedLanguage, LangName: getLanguageName(results[0].detectedLanguage) });
            } else {
                setError("The language detector can be used after model download.")

                detector = await self.ai.languageDetector.create({
                    monitor(m) {
                        m.addEventListener('downloadprogress', (e) => {
                            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                        });
                    },
                });
                await detector.ready;
            }
        })();
    }

    // trial 1
    /* const translator = async () => {
        try {
            const translatorCapabilities = await window.ai.translator.capabilities();

            if (translatorCapabilities.available === "no") {
                setError("The translator isn't usable.");
                return;
            }

            const sourceLang = languageDetected.sourcelang; // Source language detected
            const targetLang = "es"; // Change this to any target language
            const textToTranslate = output; // The text you want to translate

            console.log(`Attempting to translate from ${sourceLang} to ${targetLang}...`);

            // Check if the language pair is supported
            const isPairSupported = translatorCapabilities.supportedPairs.some(
                (pair) => pair.source === sourceLang && pair.target === targetLang
            );

            if (!isPairSupported) {
                setError(`Translation from ${sourceLang} to ${targetLang} is not supported.`);
                return;
            }

            // Proceed with translation
            if (translatorCapabilities.available === "readily") {
                const translator = await window.ai.translator.create({
                    sourceLanguage: sourceLang,
                    targetLanguage: targetLang,
                });

                const translatedText = await translator.translate(textToTranslate);
                console.log(`Translated Text: ${translatedText}`);
            } else {
                // Handle downloading of missing models
                console.log(`Model for ${sourceLang} → ${targetLang} needs downloading...`);
                const translator = await window.ai.translator.create({
                    sourceLanguage: sourceLang,
                    targetLanguage: targetLang,
                    monitor(m) {
                        m.addEventListener("downloadprogress", (e) => {
                            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                        });
                    },
                });
            }
        } catch (error) {
            console.error("Translation failed:", error);
            setError("Translation error. Please try again.");
        }
    }; */


    /* const translator = async () => {
        try {
            const translatorCapabilities = await window.ai.translator.capabilities();

            if (translatorCapabilities.available === "no") {
                setError("The translator isn't usable.");
                return;
            }

            const sourceLang = languageDetected?.sourcelang; // Ensure source language exists
            const targetLang = "en"; // Change this if needed
            const textToTranslate = output; // The text you want to translate

            console.log(`Attempting to translate from ${sourceLang} to ${targetLang}...`);

            // ✅ Check if `supportedPairs` exists before accessing it
            if (!translatorCapabilities.supportedPairs || !Array.isArray(translatorCapabilities.supportedPairs)) {
                setError("Translation capabilities are unavailable.");
                return;
            }

            // ✅ Check if the language pair is supported
            const isPairSupported = translatorCapabilities.supportedPairs.some(
                (pair) => pair.source === sourceLang && pair.target === targetLang
            );

            if (!isPairSupported) {
                setError(`Translation from ${sourceLang} to ${targetLang} is not supported.`);
                return;
            }

            // ✅ Proceed with translation
            if (translatorCapabilities.available === "readily") {
                const translator = await window.ai.translator.create({
                    sourceLanguage: sourceLang,
                    targetLanguage: targetLang,
                });

                const translatedText = await translator.translate(textToTranslate);
                console.log(`Translated Text: ${translatedText}`);
            } else {
                // ✅ Handle downloading of missing models
                console.log(`Model for ${sourceLang} → ${targetLang} needs downloading...`);
                const translator = await window.ai.translator.create({
                    sourceLanguage: sourceLang,
                    targetLanguage: targetLang,
                    monitor(m) {
                        m.addEventListener("downloadprogress", (e) => {
                            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                        });
                    },
                });
            }
        } catch (error) {
            console.error("Translation failed:", error);
            setError("Translation error. Please try again.");
        }
    }; */


    const translator = () => {
        (async () => {
            const translatorCapabilities = await window.ai.translator.capabilities();
            if (translatorCapabilities.available === "no") {
                setError("The language detector isn't usable.")
                return;
            }
            if (translatorCapabilities.available === "readily") {
                console.log(output);

                const translator = await window.ai.translator.create({
                    sourceLanguage: languageDetected.sourcelang,
                    targetLanguage: 'ru',
                });
                const translatedText = await translator.translate(output);
                console.log(translatedText);
            } else {
                const translator = await window.ai.translator.create({
                    sourceLanguage: languageDetected.sourcelang,
                    targetLanguage: 'fr',
                    monitor(m) {
                        m.addEventListener('downloadprogress', (e) => {
                            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                        });
                    },
                });
            }
            // console.log(translatorCapabilities.available);

        })();
    }



    useEffect(() => {
        detectLanguage();
    }, [output]);

    return (
        <div className="mb-8">

            <div className="w-fit md:min-w-sm min-w-max ml-auto pl-6">
                {error && <ErrorAlert error={error} onClose={() => setError("")} />}

                <div className="bg-gray-100 p-3 mb-3 rounded-md">
                    {/* output text */}
                    <div className="mb-3">{output}</div>

                    {/* detected language */}
                </div>

                <div className="flex justify-between mb-3 items-center">
                    <button className="mr-2 px-4 py-2 bg-black hover:bg-transparent border-2 border-transparent hover:border-black hover:text-black text-white rounded-sm  cursor-pointer text-xs font-semibold">Summarize</button>

                    <p className="text-right text-sm text-gray-700 font-semibold"><i className="fa fa-language"></i> {languageDetected.LangName}</p>
                </div>

                <div className="flex justify-end">
                    <button onClick={translator} className="mr-2 px-4 py-2 bg-black hover:bg-transparent border-2 border-transparent hover:border-black hover:text-black text-white rounded-sm  cursor-pointer text-xs font-semibold">
                        <i className="fa fa-globe"></i>
                        <span className="ml-1">Translate</span>
                    </button>

                    <select id="" className="bg-blue-500 py-2 px-1 text-white text-xs">
                        <option value="en">English</option>
                        <option value="pt">Portuguese</option>
                        <option value="ru">Russian</option>
                        <option value="tr">Turkish</option>
                        <option value="fr">French</option>
                    </select>
                </div>
            </div>

        </div>
    )
}

export default Chat;