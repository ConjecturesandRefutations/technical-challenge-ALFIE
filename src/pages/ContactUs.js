import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import ClipLoader from "react-spinners/ClipLoader";

import ContactImage from './../images/Img_Contact.png'

function ContactUs() {

  /* Constants for the form input fields */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneOne, setPhoneOne] = useState("");
  const [phoneTwo, setPhoneTwo] = useState("");
  const [message, setMessage] = useState("");
  const [addressOne, setAddressOne] = useState("");
  const [addressTwo, setAddressTwo] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");

  /* For whether or not the form has been submitted */
  const [submitted, setSubmitted] = useState(false);

  /* For the Loading spinner */
  const [loading, setLoading] = useState(false);

  /* For expanding the form and showing additional input fields */
  const [showAddress, setShowAddress] = useState(false);
  const [secondPhone, setSecondPhone] = useState(false);

  /* For different types of errors */
  const [requiredError, setRequiredError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [postcodeError, setPostcodeError] = useState('');
  const [addressError, setAddressError] = useState('');

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
 
  const toggleSecondPhone = (e) => {
    e.preventDefault(); 
    setSecondPhone(!secondPhone); 
  }

  const handleSubmit = (e) => {
    e.preventDefault();

/* Error Handling */

  if (!name || !email || !message) {
    setRequiredError('Please fill in all required fields.');
    return;
  } 
  
  if (phoneOne.length > 20 || phoneTwo.length > 20 ) {
    setPhoneError('Invalid Phone Number.');
    return;
  }

  if (message.length>500) {
    setMessageError('Please keep message below 500 characters.');
    return;
  }

  if (showAddress && !/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(postcode)) {
    setPostcodeError('Invalid UK postcode.');
    return;
  }

  if ((showAddress && (!addressOne || !city || !county || !country))) {
    setAddressError('Include all address details or uncheck `Add address details`.');
    return;
  }  

  const contact = {   FullName: name,
    EmailAddress: email,
    PhoneNumbers: [phoneOne, phoneTwo].filter(Boolean), 
    Message: message,
    bIncludeAddressDetails: showAddress,
    AddressDetails: {
      AddressLine1: addressOne,
      AddressLine2: addressTwo,
      CityTown: city,
      StateCounty: county,
      Postcode: postcode,
      Country: country} };

  setLoading(true);
  fetch('https://interview-assessment.api.avamae.co.uk/api/v1/contact-us/submit',  {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(contact)
  }).then(() => {
    console.log('message sent')
    console.log(contact)
    setName("");
    setEmail("");
    setPhoneOne("");
    setPhoneTwo("");
    setMessage("");
    setAddressOne("");
    setAddressTwo("");
    setCity("");
    setCounty("");
    setPostcode("");
    setCountry("");

    setLoading(false);

    setSubmitted(true);
  })
  .catch((error) => {
    console.error('Error sending the message:', error);
    setLoading(false);
  });
}

    return (

      <section className='ContactUs'>   
          <hr id='secondHr'/>

        <div className="contactText">
          <h1>Contact Us</h1>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt.
          </p>

          {!submitted &&

          <form className='contactForm' onSubmit={handleSubmit}>

            <div className='formFirstRow'>
              <div>
                <p>Full name</p>
                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} id='nameInput'/>
              </div>

                <div>
                  <p>Email Address</p>
                  <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} id='emailInput'/>
                </div>
  
            </div>

              <div>
                <p>Phone number 01 - <span style={{fontStyle:'italic'}}>optional</span></p>
                <input type="tel" name="phoneOne" value={phoneOne} onChange={(e) => setPhoneOne(e.target.value)} className='inputStyle'/>
              </div>

              {secondPhone &&
              <div id='phoneTwo'>
                <p>Phone number 02 - <span style={{fontStyle:'italic'}}>optional</span></p>
                <input  type="tel" name="phoneTwo" value={phoneTwo} onChange={(e) => setPhoneTwo(e.target.value)} className='inputStyle' style={{marginBottom:20}}/>
              </div>
              }

              <span className='error'>{phoneError}</span>

              <button id='newPhone' className='inputStyle' onClick={toggleSecondPhone}>{ !secondPhone ? 'Add new phone number' : 'Remove phone number' }</button>

              <div className='messageError'>
                <p>Message<span style={{marginLeft:150}}>{message.length}/500</span></p>
                <textarea type="text" name="message" value={message} onChange={(e) => setMessage(e.target.value)} className='inputStyle' placeholder='Maximum Text Length is 500 characters'/>
                <span className='error'>{messageError}</span>
              </div>

              <div id='checkbox'>
                <input type='checkbox' checked={showAddress}
                   onChange={(event) => setShowAddress(event.target.checked)} style={{cursor: 'pointer'}}/>
                <label>Add address details</label>
              </div>

              <span className='error'>{requiredError}</span>
              {!loading ? 
              
              <div className='submitButton'>
                  <FontAwesomeIcon className="fa" icon={faPaperPlane} />
                  <input type="submit" name="submit" id="submit" value="Submit"/>
              </div> 
              
              : 
              
              <div className='submitButton'>
                  <FontAwesomeIcon className="fa" icon={faPaperPlane} />
                  <input type="submit" name="submit" id="submit" value="Sending!" disabled/>
              </div> 
              } 
              <span className='error'>{addressError}</span>
                            
              {loading ? <ClipLoader color="#36d7b7" className="clipLoader"/> : null}


              { showAddress ?

        <section>

                <div className='formFirstRow'>
                  
                    <div>
                      <p>Address line 1</p>
                      <input type="text" name="addressOne" value={addressOne} onChange={(e) => setAddressOne(e.target.value)} className='sharedAddress' style={{marginRight:20}}/>
                    </div>

                      <div>
                        <p>Address line 2</p>
                        <input type="text" name="addressTwo" value={addressTwo} onChange={(e) => setAddressTwo(e.target.value)} className='sharedAddress'/>
                    </div>
    
                </div>

            
             <article className='formSecondRow'>
              
                    <div>
                      <p>City/Town</p>
                      <input type="city" name="city" value={city} onChange={(e) => setCity(e.target.value)} id='cityInput' className='addressInputs'/>
                    </div>
                      <div>
                        <p>State/County</p>
                        <input type="county" name="county" value={county} onChange={(e) => setCounty(e.target.value)} id='countyInput' className='addressInputs'/>
                    </div>

                    <div>
                      <p>Postcode</p>
                      <input type="text" name="postcode" value={postcode} onChange={(e) => setPostcode(e.target.value)} id='postcode' className='addressInputs'/>
                      {postcodeError && <span id='postError' className="error">{postcodeError}</span>}
                    </div>

                      <div>
                        <p>Country</p>
                        <input type="text" name="country" value={country} onChange={(e) => setCountry(e.target.value)} id='country' className='addressInputs'/>
                    </div>

              </article>


            </section>

            : null}
                            
          </form>

              }


          {submitted &&
          
          <div className='submitted'>

              <FontAwesomeIcon className="faCircle" icon={faCircleCheck}/> 
          
              <h3>Your Message Has been sent</h3>

              <p>We will be in contact with you within 24 hours</p>

          </div>
          
          }

        </div>
        <img src={ContactImage} alt='stylised infinity symbol rotated ninety degrees' id='contactImage'/>
          
      
      </section>
    );
  }
  
  export default ContactUs;
  