import React from "react";

const Contact = () => {

    return(
        <div className="recipe-contact">

            <h2>Hello, What's on your mind?</h2>
            
            <div className="recipe-contact-grid-display">

                <div className="recipe-contact-text">
                    <p>
                        Credibly administrate market positioning deliverables rather than clicks-and-mortar methodologies. 
                        Proactively formulate out-of-the-box technology with clicks-and-mortar testing procedures. 
                        Uniquely promote leveraged web-readiness for standards compliant value. Rapidiously pontificate 
                        cooperative mindshare via maintainable applications.
                    </p>
                </div>
                

                <div className="recipe-contact-form">

                    <form action="">

                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" className="contact-control" />


                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" className="contact-control" />


                        <label htmlFor="message">Message</label>
                        <textarea name="message" id="" cols="30" rows="10"></textarea>

                        <div className="button-container">
                            <button type="submit">Submit Message</button>
                        </div>

                    </form>

                </div>

            </div>

        </div>


    );

}

export default Contact;
