import { useState, useEffect, useRef, useCallback } from 'react'
import { init, send } from 'emailjs-com'

export default function Contact() {

    const [name, setName] = useState('')
    const [mail, setMail] = useState('')
    const [message, setMessage] = useState('')
    const [currentStep, setCurrentStep] = useState(1)

    const [isWorking, setIsWorking] = useState(false)

    const submit = () => {
        const userID = import.meta.env.PUBLIC_USER_ID
        const serviceID = import.meta.env.PUBLIC_SERVICE_ID
        const templateID = import.meta.env.PUBLIC_TEMPLATE_ID

        if (
            userID !== undefined &&
            serviceID !== undefined &&
            templateID !== undefined
        ) {
            init(userID)
        
            const template_param = {
                to_name: name,
                from_email: mail,
                message: message,
            }

            send(serviceID, templateID, template_param).then(() => {
                window.alert('お問い合わせを送信致しました。')
                setName('')
                setMail('')
                setMessage('')
            })
        }
    }

    const Form = () => {
        return (
            <div>
                <form>
                    <div>
                    <label htmlFor="nameForm">ご氏名：</label>
                    </div>
                    <input
                        type="text"
                        id="nameForm"
                        className="formInput"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    
                    <div>
                        <label htmlFor="mailForm">メールアドレス：</label>
                    </div>
                    <input
                        type="email"
                        id="mailForm"
                        className="formInput"
                        value={mail}
                        required
                        onChange={(e) => setMail(e.target.value)}
                    />

                    <div>
                        <label htmlFor="mailContentForm">お問い合わせ内容：</label>
                    </div>
                    <textarea
                        id="mailContentForm"
                        className="formInput"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </form>
             </div>
        )
    }

    const handleNextStepClick = () => {
        setCurrentStep(currentStep + 1)
    }

    const NextBtn = () => {
        return (
            currentStep !== Object.keys(questions_old).length ? (
                <button onClick={() => handleNextStepClick()}>次のSTEPへ</button>
            )
            :
            <button onClick={() => submit()}>送信</button>
        );
    }

    const questions_old: {
        [key: number]: { question: string; options?: string[]; type: string }[];
      } = {
        1: [
            {
                question: "現在、正社員ですか？",
                options: [
                    "はい", "いいえ"
                ],
                type: "option"
            },
            {
                question: "現在の年収は？",
                type: "text"
            }
        ],
        2 : [
            {
                question: "暑いですか？",
                options: [
                    "yes", "no"
                ],
                type: "option"
            },
            {
                question: "今どこにいますか？",
                type: "text"
            }
        ],
        3: [
            {
                question: "どっちですか？",
                options: [
                    "O型", "どちらでもない"
                ],
                type: "option"
            }
        ],
        4: [
            {
                question: "名前",
                type: "text"
            },
            {
                question: "メールアドレス",
                type: "text" 
            }
        ]
    }

    return (
        <div>
          <link rel='stylesheet' href="/styles/style.css" />
          {
            questions_old[currentStep].map((ele, index) => {
              return (
                <div key={index}>
                  <p>{ele.question}</p>
      
                  {
                    ele.options && ele.options.map((option, optIndex) => {
                      return (
                        <button key={optIndex} data-value={option}>{option}</button>
                      )
                    })
                  }
                  {
                    ele.type === "text" ?
                    (
                        <textarea />
                    )
                    :
                    ""
                  }
                </div>
              );
            })
          }
          <NextBtn />
        </div>
    )
}
