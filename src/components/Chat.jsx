import { useState, useEffect } from "react"

import ErrorAlert from "./ErrorAlert"; import { source } from "framer-motion/client";
import LoadingAlert from "./LoadingAlert";


function Chat({ output }) {

    const [processedOutput, setProcessedOutput] = useState(output);

    const [error, setError] = useState("");
    const [loadingMessage, setLoadingMessage] = useState("");
    const [languageDetected, setLanguageDetected] = useState({ sourcelang: "", LangName: "" });
    const [targetLanguage, setTargetLanguage] = useState('en')
    const [translatedOutput, setTranslatedOutput] = useState("");
    const [loading, setLoading] = useState(false);

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

    const getLanguageName = (langCode) => languageMap[langCode] || languageMap[langCode];

    const detectLanguage = () => {

        (async () => {
            try {

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

                    const results = await detector.detect(processedOutput);

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
            } catch (error) {
                setError(`error Detecting Language: ${error}`);
            }
        })();
    }

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
                        const translatedText = await translator.translate(processedOutput);
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
                setError(`Error Translating: ${error}`);
            }

        })();
    }

    async function summarise(longText) {
        try {
            const summarizerCapabilities = await self.ai.summarizer.capabilities();
            const canSummarize = summarizerCapabilities.available;
            let summarizer;

            if (canSummarize === 'no') {
                console.warn(
                    "The current browser supports the Summarizer API, but it can't be used at the moment. Check the available disk space"
                );
                return;
            }
            if (canSummarize === 'after-download') {
                console.log('Downloading translation model...');
                summarizer = await self.ai.summarizer.create({
                    monitor(m) {
                        m.addEventListener('downloadprogress', (e) => {
                            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                        });
                    },
                });
                await summarizer.ready;
            } else {
                summarizer = await self.ai.summarizer.create();
            }

            return await summarizer.summarize(longText);
        } catch (error) {
            setError("error summarizing");
        }
    }

    // summarise("Frontend programming is the process of building the user interface and user experience of a website or web application using programming languages like HTML, CSS, and JavaScript. It involves creating the visual aspects of a website, including the layout, colors, and typography, as well as the interactive elements, such as buttons, forms, and animations. Frontend developers use various tools and frameworks, such as React, Angular, and Vue.js, to build responsive and dynamic web applications that provide a seamless user experience. They must also ensure that the website is accessible and usable on different devices and browsers. With the rise of mobile devices and the increasing demand for online services, frontend programming has become a crucial aspect of web development. It requires a combination of technical skills, creativity, and attention to detail to create visually appealing and user-friendly interfaces that meet the needs of users. Effective frontend programming can make a significant difference in the success of a website or web application, as it directly impacts the user experience and engagement. Frontend programming is a constantly evolving field, with new technologies and techniques emerging regularly, making it an exciting and challenging career path for developers. provide a seamless user experience. They must also ensure that the website is accessible and usable on different devices and browsers. With the rise of mobile devices and the increasing demand for online services, frontend programming has become a crucial aspect of web development. It requires a combination of technical skills, creativity, and attention to detail to create visually appealing and user-friendly interfaces that meet the needs of users. Effective frontend programming can make a significant difference in the success of a website or web application");
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
                {loading && <LoadingAlert message={loadingMessage} />}

                <div className=" mb-3">
                    {/* output text */}
                    <div className="mb-3 text-white">{processedOutput}</div>

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