import { useState, useEffect, useRef, useCallback } from 'react'
import { init, send } from 'emailjs-com'

export default function Contact() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isWorkingError, setIsWorkingError] = useState(false)
    const [isSalaryError, setIsSalaryError] = useState(false)
    const [isJobChangeError, setIsJobChangeError] = useState(false)
    const [isHouseError, setIsHouseError] = useState(false)
    const [isNameError, setIsNameError] = useState(false)
    const [isMailError, setIsMailError] = useState(false)
    const [mailErrortext, setMailErrortext] = useState('')

    // 解答保持用State
    const [isWorking, setIsWorking] = useState('')
    const [currentSalary, setCurrentSalary] = useState('')
    const [wantChangeJob, setWantChangeJob] = useState('')
    const [currentHouse, setCurrentHouse] = useState('')
    const [name, setName] = useState('')
    const [mail, setMail] = useState('')
    // 解答保持用State

    const needToSelectText = "選択してください"
    const needToInputText = "入力してください"
    const needToCheckEmail = "有効なアドレスを入力してください"

    const createMailContent = () => {
        let formattedQandA: string[] = []
        let questionsArray:string[] = []
        for (let i = 1; i < Object.keys(questions).length + 1; i++)　{
            questions[i].map((ele) => {
                questionsArray.push(ele.question)
            })
        }
        questionsArray.map((ele, index) => {
            switch(index) {
                case 0:
                    formattedQandA.push(`${ele}: ${isWorking}`)
                    break
                case 1:
                    formattedQandA.push(`${ele}: ${currentSalary}`)
                    break
                case 2:
                    formattedQandA.push(`${ele}: ${wantChangeJob}`)
                    break
                case 3:
                    formattedQandA.push(`${ele}: ${currentHouse}`)
                    break
                case 4:
                    formattedQandA.push(`${ele}: ${name}`)
                    break
                case 5:
                    formattedQandA.push(`${ele}: ${mail}`)
                    break
            }
        })
        return formattedQandA.join('\n')
    }

    const submit = () => {
        const userID = import.meta.env.PUBLIC_USER_ID
        const serviceID = import.meta.env.PUBLIC_SERVICE_ID
        const templateID = import.meta.env.PUBLIC_TEMPLATE_ID

        if (
            checkValidate() &&
            userID !== undefined &&
            serviceID !== undefined &&
            templateID !== undefined
        ) {
            init(userID)
        
            const template_param = {
                message: createMailContent(),
            }

            setCurrentStep(currentStep + 1)
            send(serviceID, templateID, template_param).then(() => {
                setCurrentStep(currentStep + 1)
            })
        }
    }

    const checkEmail = (val: string) => {
        if(!val.match(/.+@.+\..+/)) {
            return false
        } else {
            return true
        }
    }


    const checkValidate = () => {
        switch(currentStep) {
            case 1:
                if(isWorking === "" && currentSalary === "") {
                    setIsWorkingError(true)
                    setIsSalaryError(true)
                } else if(isWorking === "") {
                    setIsWorkingError(true)
                    setIsSalaryError(false)
                } else if(currentSalary === "") {
                    setIsSalaryError(true)
                    setIsWorkingError(false)
                }  else if(isWorking !== "" && currentSalary !== "") {
                    setIsWorkingError(false)
                    setIsSalaryError(false)
                    return true
                }
                break
            case 2:
                if(wantChangeJob === "" && currentHouse === "") {
                    setIsJobChangeError(true)
                    setIsHouseError(true)
                } else if(wantChangeJob === "") {
                    setIsJobChangeError(true)
                    setIsHouseError(false)
                } else if(currentHouse === "") {
                    setIsHouseError(true)
                    setIsJobChangeError(false)
                } else if(wantChangeJob !== "" && currentHouse !== "") {
                    setIsJobChangeError(false)
                    setIsHouseError(false)
                    return true
                }
                break
            case 3:
                if(name === "") {
                    setIsNameError(true)
                } else {
                    setIsNameError(false)
                }

                if(mail === "") {
                    setIsMailError(true)
                    setMailErrortext(needToInputText)
                } else if(!checkEmail(mail)) {
                    setIsMailError(true)
                    setMailErrortext(needToCheckEmail)
                } else {
                    setIsMailError(false)
                }

                if(name !== "" && mail !== "" && checkEmail(mail)) {
                    setIsNameError(false)
                    setIsMailError(false)
                    return true
                }
                break
        }

    }
    const handleNextStepClick = () => {
        if(checkValidate()) {
            setCurrentStep(currentStep + 1)
        }
    }

    const questions: {
        [key: number]: { question: string; options?: string[]; type: string; questionNumber: number; }[]
    } = {
            1: [
                {
                    question: "現在、正社員ですか？",
                    options: [
                        "はい", "いいえ"
                    ],
                    type: "option",
                    questionNumber: 1
                },
                {
                    question: "現在の年収は？",
                    type: "select",
                    options: [
                        "選択してください",
                        "~300万",
                        "301万~500万",
                        "1000万~"
                    ],
                    questionNumber: 2
                }
            ],
            2 : [
                {
                    question: "転職を希望しますか？",
                    options: [
                        "はい", "いいえ"
                    ],
                    type: "option",
                    questionNumber: 3
                },
                {
                    question: "お住まいの都道府県",
                    type: "select",
                    options: [
                        "選択してください",
                        "東京",
                        "北海道",
                        "福岡"
                    ],
                    questionNumber: 4
                }
            ],
            3: [
                {
                    question: "名前",
                    type: "text",
                    questionNumber: 5
                },
                {
                    question: "メールアドレス",
                    type: "text" ,
                    questionNumber: 6
                },
                {
                    question: "お問い合わせ内容",
                    type: "textArea" ,
                    questionNumber: 7
                }
            ]
        }

    const NextBtn = () => {
        return (
            currentStep !== Object.keys(questions).length ? (
                <button onClick={() => handleNextStepClick()}>次のSTEPへ</button>
            )
            :
            <button onClick={() => submit()}>送信</button>
        );
    }

    const ThanksArea = () => {
        return (
            <p>フォーム送信ありがとうございます</p>
        )
    }

    return (
        <div className='test'>
            <link rel='stylesheet' href="/css/style.css" />
            {
                currentStep > Object.keys(questions).length ?
                <ThanksArea />
                :
                <>
                    {
                        questions[currentStep].map((ele, index) => {
                            return (
                                <div key={index}>
                                    <p>{ele.question}</p>
                                    {
                                        ele.questionNumber === 1 &&
                                            <div>
                                                <div>
                                                    {ele.options?.map((option, optIndex) => (
                                                        <button
                                                            key={optIndex}
                                                            onClick={(e) => {
                                                                setIsWorking(e.currentTarget.textContent || "")
                                                            }}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                                {isWorkingError && <span>{needToSelectText}</span>}
                                            </div>
                                    }
                                    {
                                        ele.questionNumber === 2 &&
                                        <div>
                                            <select
                                                onChange={(e) => {
                                                    if(e.target.value === needToSelectText) {
                                                        setCurrentSalary("")
                                                    } else {
                                                        setCurrentSalary(e.target.value)
                                                    }
                                                }}
                                            >
                                                {ele.options?.map((option, optIndex) => (
                                                    <option key={optIndex} value={option} data-value={option}>{option}</option>
                                                ))}
                                            </select>
                                            {isSalaryError && <span>{needToSelectText}</span>}
                                        </div>
                                    }
                                    {
                                        ele.questionNumber === 3 && 
                                            <div>
                                                <div>
                                                    {ele.options?.map((option, optIndex) => (
                                                        <button
                                                            key={optIndex}
                                                            onClick={(e) => {
                                                                setWantChangeJob(e.currentTarget.textContent || "")
                                                            }}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                                {isJobChangeError && <span>{needToSelectText}</span>}
                                            </div>
                                    }
                                    {
                                        ele.questionNumber === 4 && 
                                        <div>
                                            <select
                                                onChange={(e) => {
                                                    if(e.target.value === needToSelectText) {
                                                        setCurrentHouse("")
                                                    } else {
                                                        setCurrentHouse(e.target.value)
                                                    }
                                                }}
                                            >
                                                {ele.options?.map((option, optIndex) => (
                                                    <option key={optIndex} value={option} data-value={option}>{option}</option>
                                                ))}
                                            </select>
                                            {isHouseError && <span>{needToSelectText}</span>}
                                        </div>
                                    }
                                    {
                                        ele.questionNumber === 5 && 
                                            <div>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(event) => setName(event.target.value)}
                                                />
                                                {isNameError && <span>{needToInputText}</span>}
                                            </div>
                                    }
                                    {
                                        ele.questionNumber === 6 &&
                                            <div>
                                                <input
                                                    type="text"
                                                    value={mail}
                                                    onChange={(event) => setMail(event.target.value)}
                                                />
                                                {isMailError && <span>{mailErrortext}</span>}
                                            </div>
                                    }
                                </div>
                            )
                        })
                    }
                    <NextBtn/>
                </>
            }
        </div>
    )
}
