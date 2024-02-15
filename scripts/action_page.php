<?php
if($_POST){
    $name = $_POST['Name'];
    $email = $_POST['Email'];
    $message = $_POST['Message'];

    // Enter your email address
    $to = 'pietro.traversa98@gmail.com.com';

    $subject = 'New Message from Website';

    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    $body = "You have received a new message from your website contact form.\n\n";
    $body .= "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Message:\n$message\n";

    // Send the email
    if(mail($to, $subject, $body, $headers)){
        echo 'Message sent!';
    } else{
        echo 'Error: Could not send message.';
    }
}
?>