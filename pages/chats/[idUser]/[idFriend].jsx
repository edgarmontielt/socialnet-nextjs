import { useState, useRef, useEffect } from 'react'
import { child, get, onValue, push, ref } from 'firebase/database'
import { realTimeDB } from '../../../config/firebase'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { HeadComponent } from '../../../components/utils/HeadComponent'
import MyFriends from '../../../components/friends'

export default function Chat() {
    const [messages, setMessages] = useState([])
    const messageInput = useRef()
    const router = useRouter()
    const { idUser, idFriend } = router.query
    const { friends } = useSelector(state => state.users)

    useEffect(() => {
        const chatRef = ref(realTimeDB, `chats/${idUser}/${idFriend}`)
        if (idUser && idFriend) {
            onValue(chatRef, (snapshot) => {
                if (snapshot.exists()) {
                    setMessages(snapshot.val().messages)
                }
                messageInput.current.value = ''
            })
        }
    }, [idFriend])

    const sendMessage = () => {
        const message = messageInput.current.value
        const dbRef = ref(realTimeDB)
        push(child(dbRef, `chats/${idUser}/${idFriend}/messages`), {
            content: message,
            sender: idUser,
            date: new Date().toISOString()
        })
        push(child(dbRef, `chats/${idFriend}/${idUser}/messages`), {
            content: message,
            sender: idUser,
            date: new Date().toISOString()
        })
    }

    return (
        <>
            <HeadComponent title={'Chat'} />
            <section className='flex'>
                <section>
                    {friends ?
                        <MyFriends friends={friends} />
                        :
                        <p>Dont have Friends</p>
                    }
                </section>
                <div className='max-w-screen-md w-full mx-auto mt-20 overflow-y-scroll h-[70vh] mb-24 py-10'>
                    {Object.entries(messages).map(([id, data]) => (
                        <div key={id}
                            className={`rounded-full py-2 px-4 gap-2 text-white font-medium w-max mb-2 ${data.sender == idUser ?
                                'ml-auto bg-blue-500' :
                                'bg-green-500'
                                }`
                            }>
                            <p>{data.content}</p>
                        </div>
                    ))}
                    <div className='flex bg-white p-10 mt-10 fixed bottom-0 w-[768px] mx-auto gap-5'>
                        <input ref={messageInput} className="w-full outline-none bg-transparent border-[1px] rounded-full p-3" placeholder='Write message...'></input>
                        <button onClick={sendMessage}>Enviar</button>
                    </div>
                </div>
            </section>
        </>
    )
}
