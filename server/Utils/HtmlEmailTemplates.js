function get_otp_template(email,otp){
return `
<!DOCTYPE HTML>
<html>
    <body style="background-color:#ebebed;font-family:'Verdana', sans-serif;font-size:16px;">

        <div style="margin:20px 0vw 20px;height:90vh;background-color:#ffffff;border-radius:12px;padding-bottom:12px">

            <p style="margin:0px;background-image:linear-gradient(#001e80,#4545bf );border-radius:12px 12px 0px 0px;font-size:2rem;padding-top:1rem;font-weight:bold;color:#ffffff;text-align:center;height:10vh">
            Drone Connect
            </p>

            <table style="margin:0px 12px">
                <tbody>
                    <tr>
                        <td><h3 style="font-size:30px;margin-bottom:8px">Greetings ${email.match(/\S+(?=[\+,@])/)}, </h3>
                            <p style="padding:0px; margin:0px;color:#001e80">You are just one step away from joining us.</p>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style= "margin-bottom:2px">Mentioned below is your One Time Password(OTP) for verifying your email. <span style ="font-weight:bold">OTP is valid only for 5 minutes</span>. </p> 
                            <p style= "margin-top:0px">Please do not share your OTP with anyone else.</p>
                        </td>
                    </tr>

                    <tr >
                        <td style="padding-top:18px">
                            <p style="font-weight:bold; font-size:30px; text-align:center;color:#001e80">${otp}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="margin-top:100px">Regards,<br> <span style="color:#001e80;font-weight:bold">Drone Connect</span></p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
</html>
        `;
}

function get_pilot_creds_template(email,password){
return `
<!DOCTYPE HTML>
<html>
    <body style="background-color:#ebebed;font-family:'Verdana', sans-serif;font-size:16px;">

        <div style="margin:20px 0vw 20px;height:90vh;background-color:#ffffff;border-radius:12px;padding-bottom:12px">

            <p style="margin:0px;background-image:linear-gradient(#001e80,#4545bf );border-radius:12px 12px 0px 0px;font-size:2rem;padding-top:1rem;font-weight:bold;color:#ffffff;text-align:center;height:10vh">
            Drone Connect
            </p>

            <table style="margin:0px 12px">
                <tbody>
                    <tr>
                        <td><h3 style="font-size:30px;margin-bottom:8px">Greetings ${email.match(/\S+(?=[\+,@])/)}, </h3>
                            <p style="padding:0px; margin:0px;color:#001e80">Welcome to DroneConnect! </p>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style= "margin-bottom:2px">Mentioned below is your password for logging in with us.</p> 
                            <p style= "margin-top:0px">Please do not share your password with anyone else. Please reset it after logging in</p>
                        </td>
                    </tr>

                    <tr >
                        <td style="padding-top:18px">
                            <p style="font-weight:bold; font-size:30px; text-align:center;color:#001e80">${password}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="margin-top:100px">Regards,<br> <span style="color:#001e80;font-weight:bold">Drone Connect</span></p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
</html>
        `;
}

function get_pilot_confirmation_template(options){
return `
<!DOCTYPE HTML>
<html>
    <body style="background-color:#ebebed;font-family:'Verdana', sans-serif;font-size:16px;">

        <div style="margin:20px 0vw 20px;height:90vh;background-color:#ffffff;border-radius:12px;padding-bottom:12px">

            <p style="margin:0px;background-image:linear-gradient(#001e80,#4545bf );border-radius:12px 12px 0px 0px;font-size:2rem;padding-top:1rem;font-weight:bold;color:#ffffff;text-align:center;height:10vh">
            Drone Connect
            </p>

            <table style="margin:0px 12px">
                <tbody>
                    <tr>
                        <td><h3 style="font-size:30px;margin-bottom:8px">Greetings ${options.to.match(/\S+(?=[\+,@])/)}, </h3>
                            <p style="padding:0px; margin:0px;color:#001e80">We found the perfect pilot for your event </p>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style= "margin-bottom:2px"><span style="font-weight:bold">${options.pilot_name}</span> just confirmed that they will be available for your event ${options.event_name}. You can contact them at: <span style="font-weight:bold">${options.pilot_email}</span>. </p> 
                            <p style= "margin-top:0px">Further details are available on the website under bookings section. We would also love to hear about your experience and feedback through the reviews.</p>
                        </td>
                    </tr>
        <tr>
        <td>
        <p style="margin-bottom:2px">We hope you have a wonderful event and create ever-lasting memories :)</p>
        </td>
        </tr>

                    <tr>
                        <td>
                            <p style="margin-top:100px">Thank you<br> Regards,<br> <span style="color:#001e80;font-weight:bold">Drone Connect</span></p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
</html>
        `;
}
function get_send_booking_info_to_pilot_template(options){
return `
<!DOCTYPE HTML>
<html>
    <body style="background-color:#ebebed;font-family:'Verdana', sans-serif;font-size:16px;">

        <div style="margin:20px 0vw 20px;height:90vh;background-color:#ffffff;border-radius:12px;padding-bottom:12px">

            <p style="margin:0px;background-image:linear-gradient(#001e80,#4545bf );border-radius:12px 12px 0px 0px;font-size:2rem;padding-top:1rem;font-weight:bold;color:#ffffff;text-align:center;height:10vh">
            Drone Connect
            </p>

            <table style="margin:0px 12px">
                <tbody>
                    <tr>
                        <td><h3 style="font-size:30px;margin-bottom:8px">Greetings ${options.to.match(/\S+(?=[\+,@])/)}, </h3>
                            <p style="padding:0px; margin:0px;color:#001e80">You are confirmed !!</p>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style= "margin-bottom:2px">You are confirmed for the event details attached below. Please report at the event <span style="font-weight:bold">30 minutes </span> before time. </p> 
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style= " font-weight:bold">Customer name: ${options.customer_name}
        <br>Customer email: ${options.customer_email} 
        <br>Event booked for: ${options.booking_title} 
        <br>Start Date: ${options.booking_start_date} at ${options.booking_start_time}

        <br>Start Date: ${options.booking_end_date} uptil ${options.booking_end_time}
        <br>Location: ${options.booking_location} 
    </p>
                        </td>
                    </tr>


                    <tr>
                        <td>
        <p style="margin-bottom:2px"> We hope you have a wonderful time and experience! </p>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style="margin-top:100px">Thank you<br> Regards,<br> <span style="color:#001e80;font-weight:bold">Drone Connect</span></p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
</html>
        `;
}

module.exports={get_otp_template, get_pilot_creds_template, get_pilot_confirmation_template,get_send_booking_info_to_pilot_template}

