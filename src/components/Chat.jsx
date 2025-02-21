import { useState, useEffect } from "react"

import ErrorAlert from "./ErrorAlert"; import { source } from "framer-motion/client";
import LoadingAlert from "./LoadingAlert";


function Chat({ output }) {

    const [error, setError] = useState("");
    const [loadingMessage, setLoadingMessage] = useState("");
    const [languageDetected, setLanguageDetected] = useState({ sourcelang: "", LangName: "" });
    const [targetLanguage, setTargetLanguage] = useState('en')
    const [translatedOutput, setTranslatedOutput] = useState("");
    const [ loading, setLoading ] = useState(false);

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
            try {
                const translatorCapabilities = await self.ai.translator.capabilities();
                const userSourceLanguage = languageDetected.sourcelang;
                const userTargetLanguage = targetLanguage;
                if (translatorCapabilities.available === "no") {
                    setError("The language detector isn't usable.")
                    return;
                }
                if (translatorCapabilities.available === "readily") {


                    if (translatorCapabilities.languagePairAvailable(userSourceLanguage, userTargetLanguage) === "readily") {
                        setLoading(true);
                        setLoadingMessage("Translating...");


                        const translator = await self.ai.translator.create({
                            sourceLanguage: userSourceLanguage,
                            targetLanguage: userTargetLanguage,
                        });
                        const translatedText = await translator.translate(output);
                        setTranslatedOutput(translatedText)

                        setLoading(false);
                        setLoadingMessage("");
                        
                        console.log(translatedText);


                    } else {
                        const translator = await self.ai.translator.create({
                            sourceLanguage: userSourceLanguage,
                            targetLanguage: userTargetLanguage,
                            monitor(m) {
                                m.addEventListener('downloadprogress', (e) => {
                                    console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                                });
                            },
                        });
                        setError('Language Pair not supported');
                        return;
                    }

                } else {
                    const translator = await self.ai.translator.create({
                        sourceLanguage: userSourceLanguage,
                        targetLanguage: userTargetLanguage,
                        monitor(m) {
                            m.addEventListener('downloadprogress', (e) => {
                                console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                            });
                        },
                    });
                }
            } catch (error) {
                console.error(`Error Translating: ${error}`)
                setError('Try again later');
            }

            // console.log(translatorCapabilities.available);

        })();
    }

    function targetLangHandler(event) {
        const targetLang = event.target.value;
        setTargetLanguage(targetLang);
    }



    useEffect(() => {
        detectLanguage();
    }, [output]);

    return (
        <div className=" p-3">

            {/* input text */}
            <div className="w-fit md:min-w-sm min-w-max ml-auto mb-3 p-4 bg-gray-500 rounded-md">
                {error && <ErrorAlert error={error} onClose={() => setError("")} />}

                {/* loading alert */}
                {loading && <LoadingAlert message={loadingMessage}/>}

                <div className=" mb-3">
                    {/* output text */}
                    <div className="mb-3 text-white">{output}</div>

                </div>

                <div className="flex justify-between mb-3 items-center">

                    {/* detected language */}
                    <p className="text-right text-[13px] text-white">Detected Languaguage: <i className="fa fa-language"></i> {languageDetected.LangName}</p>
                </div>

                <div className="flex justify-between items-center">

                    {/* for summarizing not yet implemented*/}
                    <div>
                        {/* <button className="mr-2 px-4 py-2 bg-gray-800 text-white rounded-sm  cursor-pointer text-xs font-semibold">Summarize</button> */}
                    </div>

                    <div>
                        <select value={targetLanguage} onChange={targetLangHandler} className="border-[1px] hover:ring-1 hover:ring-white py-2 px-1 text-black text-xs mr-2">
                            <option value="en">English</option>
                            <option value="pt">Portuguese</option>
                            <option value="es">Spanish</option>
                            <option value="ru">Russian</option>
                            <option value="tr">Turkish</option>
                            <option value="fr">French</option>
                        </select>

                        <button onClick={translator} className="px-4 py-2 bg-gray-800 text-white rounded-sm  cursor-pointer text-xs font-semibold">
                            <i className="fa fa-globe"></i>
                            <span className="ml-1">Translate</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* translation or summary */}
            {translatedOutput && (
                <div className="bg-gray-300 p-3 w-sm">
                    <p>{translatedOutput}</p>
                </div>
            )}

        </div>
    )
}

export default Chat;