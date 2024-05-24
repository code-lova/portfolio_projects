import axios from "axios";
import React, {useState} from "react";
import { toast } from "react-toastify";

const ContactAdmin = () => {

    const [contact, setContact] = useState({
        subject: '',
        message: ''
    });

    const handleInput = (e) => {
        e.persist();
        setContact({...contact, [e.target.name]: e.target.value});
    }

    const resetInputFields = () => {
        setContact({...contact, 
            subject: '',
            message: ''
        })
    }


    const submitContact = (e) => {
        e.preventDefault();

        const data = {
            subject:contact.subject,
            message:contact.message
        }
        try{

            axios.post(`http://localhost:3000/api/create-contact`, data).then(res => {
                if(res.data.status === 200){
                    toast.success(res.data.message, {
                        theme: 'colored'
                    })
                    resetInputFields();
                }else{
                    toast.error(res.data.message, {
                        theme: 'colored'
                    })
                }
            });
        }catch(error){
            console.error("Problem sending Message to admin", error)
        }
    }

    return(
        <div>
            <div className="main-content">
                <h2>Contact Administrator
                    {/* <Link to="#">
                        <span className="other-h2-span">Go Back</span>
                    </Link> */}
                </h2>

                <div className="other-large-display">
                    <div className="user-card">
                        <div className="other-header">
                            <h3>Leave a Message</h3>
                        </div>

                        <div className="other-body">
                            <form onSubmit={submitContact}>
                                <div className="group-12">
                                    <div className="forms-groups">
                                        <label htmlFor="subject">Subject</label>
                                        <input type="text" name="subject" onChange={handleInput} value={contact.subject} placeholder="Enter subject of the message" />
                                    </div>
                                </div>

                                <div className="forms-groups">
                                    <label htmlFor="message">Message</label>
                                    <textarea name="message" onChange={handleInput} value={contact.message} cols="30" rows="10" placeholder="Enter your message"></textarea>
                                </div>

                                <div className="group-6">
                                    <button type="submit">Send Message</button>
                                </div>
                            </form>

                        </div>
                    </div>



                </div>

            </div>
        </div>


    );

}

export default ContactAdmin;
