import { useState, useRef } from "react";

function ChatInterface() {
    const [output, setOutput] = useState('Output goes here... ');
    const inputElement = useRef();

    const handleOutput = () => {
        const inputtext = inputElement.current;
        setOutput(inputtext.value);
        inputtext.value = '';
        inputtext.focus();
    }
    return (
        // container body of the interface
        <div className="min-h-screen bg-gray-100 sm:py-20 py-10 px-2 flex justify-center items-center">

            {/* interface starts */}
            <div className="max-w-xl w-full rounded-lg bg-gray-200 shadow-lg shadow-gray-400">

                {/* chat header */}
                <div className="chat-header text-center bg-black text-white px-2 py-3">
                    <h2>Ai text interface</h2>
                </div>

                {/* chat output */}
                <div className="chat-output p-3 mb-20">

                    <div className="bg-gray-100 p-3 mb-3 rounded-md">
                        {/* output text */}
                        <div className="mb-3">{output}</div>

                        {/* detected language */}
                        <p className="text-right text-sm text-gray-700 font-semibold"><i className="fa fa-language"></i> English</p>
                    </div>

                    <div className="mb-3">
                        <button className="px-4 py-2 bg-black text-white rounded-sm cursor-pointer">Summarize</button>
                    </div>

                    <div>
                        <button className="mr-2 px-4 py-2 bg-black text-white rounded-sm cursor-pointer">Translate</button>

                        <select id="" className="bg-black py-2 px-1 text-white">
                            <option value="en">English</option>
                            <option value="pt">Portuguese</option>
                            <option value="ru">Russian</option>
                            <option value="tr">Turkish</option>
                            <option value="fr">French</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-end gap-3 p-2">
                    <textarea name="input" ref={inputElement} className="grow-1 resize-none border-2 border-gray-400 bg-gray-100 rounded-lg h-32 px-3 py-1 text-nowrap">

                    </textarea>

                    <button
                        onClick={handleOutput}
                        className="grow-0 bg-black text-white h-11 w-11 cursor-pointer rounded-lg"><i className="fa fa-send"></i></button>
                </div>
            </div>
        </div>
    )
}

export default ChatInterface;