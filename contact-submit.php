<?php

declare( strict_types = 1 );

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/vendor/autoload.php';

header( 'Content-Type: application/json' );

date_default_timezone_set( 'Asia/Kolkata' );

$response = [
    'status'  => false,
    'message' => 'Something went wrong.'
];

/*
|--------------------------------------------------------------------------
| Allow Only POST Request
|--------------------------------------------------------------------------
*/

if ( $_SERVER[ 'REQUEST_METHOD' ] !== 'POST' ) {

    $response[ 'message' ] = 'Invalid Request Method.';

    echo json_encode( $response );

    exit;
}

/*
|--------------------------------------------------------------------------
| Sanitize Input
|--------------------------------------------------------------------------
*/

function clean( $value ): string
 {
    return htmlspecialchars( trim( $value ), ENT_QUOTES, 'UTF-8' );
}

/*
|--------------------------------------------------------------------------
| Form Data
|--------------------------------------------------------------------------
*/

$fullName = clean( $_POST[ 'full_name' ] ?? '' );
$email    = clean( $_POST[ 'email' ] ?? '' );
$mobile   = clean( $_POST[ 'mobile_number' ] ?? '' );
$city     = clean( $_POST[ 'city' ] ?? '' );
$course   = clean( $_POST[ 'course' ] ?? '' );

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

$errors = [];

if ( $fullName === '' ) {
    $errors[] = 'Full Name is required.';
}

if ( !filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
    $errors[] = 'Valid Email Address is required.';
}

if ( $mobile === '' ) {
    $errors[] = 'Mobile Number is required.';
}

if ( $city === '' ) {
    $errors[] = 'City is required.';
}

if ( $course === '' ) {
    $errors[] = 'Course is required.';
}

if ( !empty( $errors ) ) {

    $response[ 'message' ] = implode( '<br>', $errors );

    echo json_encode( $response );

    exit;
}

/*
|--------------------------------------------------------------------------
| Current Information
|--------------------------------------------------------------------------
*/

$currentDate = date( 'd M Y h:i A' );

$currentYear = date( 'Y' );

$ipAddress = $_SERVER[ 'REMOTE_ADDR' ] ?? 'Unknown';

$userAgent = $_SERVER[ 'HTTP_USER_AGENT' ] ?? 'Unknown';

/*
|--------------------------------------------------------------------------
| PHPMailer
|--------------------------------------------------------------------------
*/

$mail = new PHPMailer( true );

try {

    $mail->isSMTP();

    $mail->Host = 'smtpout.secureserver.net';
    $mail->SMTPAuth = true;

    $mail->Username = 'contact@futurecolleges.in';
    $mail->Password = '';

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->CharSet = 'UTF-8';
    $mail->isHTML( true );

    /*
    |--------------------------------------------------------------------------
    | Admin Email
    |--------------------------------------------------------------------------
    */

    $mail->setFrom(
        'contact@futurecolleges.in',
        'Future College'
    );

    $mail->addAddress(
        'contact@futurecolleges.in',
        'Future College'
    );

    $mail->addReplyTo(
        $email,
        $fullName
    );

    $mail->Subject = '🎓 New Admission Enquiry - Future College';

    $mail->Body = "

    <div style='max-width:700px;margin:30px auto;background:#ffffff;border:1px solid #e5e5e5;font-family:Arial,sans-serif;'>

        <div style='background:#0F4C81;color:#ffffff;padding:25px;text-align:center;'>

            <h2 style='margin:0;'>Future College</h2>

            <p style='margin-top:8px;'>New Admission Enquiry</p>

        </div>

        <table width='100%' cellpadding='12' cellspacing='0' style='border-collapse:collapse;'>

            <tr>

                <td width='35%'><strong>Full Name</strong></td>

                <td>{$fullName}</td>

            </tr>

            <tr style='background:#f8f8f8;'>

                <td><strong>Email Address</strong></td>

                <td>{$email}</td>

            </tr>

            <tr>

                <td><strong>Mobile Number</strong></td>

                <td>{$mobile}</td>

            </tr>

            <tr style='background:#f8f8f8;'>

                <td><strong>City</strong></td>

                <td>{$city}</td>

            </tr>

            <tr>

                <td><strong>Interested Course</strong></td>

                <td>{$course}</td>

            </tr>

            <tr style='background:#f8f8f8;'>

                <td><strong>Submission Date</strong></td>

                <td>{$currentDate}</td>

            </tr>

            <tr>

                <td><strong>IP Address</strong></td>

                <td>{$ipAddress}</td>

            </tr>

            <tr style='background:#f8f8f8;'>

                <td><strong>Browser</strong></td>

                <td>{$userAgent}</td>

            </tr>

        </table>

        <div style='padding:20px;background:#fafafa;text-align:center;color:#666;font-size:13px;'>

            This enquiry was submitted from the
            <strong>Future College Official Website</strong>.

        </div>

    </div>

    ";

    $mail->send();

    /*
    |--------------------------------------------------------------------------
    | Student Auto Reply
    |--------------------------------------------------------------------------
    */

    $mail->clearAddresses();
    $mail->clearReplyTos();
    $mail->clearCCs();
    $mail->clearBCCs();
    $mail->clearAttachments();

    $mail->setFrom(
        'contact@futurecolleges.in',
        'Future College'
    );

    $mail->addAddress(
        $email,
        $fullName
    );

    $mail->Subject = 'Thank You for Your Admission Enquiry';

    $mail->Body = "

    <div style='max-width:700px;margin:30px auto;background:#ffffff;border:1px solid #e5e5e5;font-family:Arial,sans-serif;'>

        <div style='background:#0F4C81;padding:30px;text-align:center;color:#ffffff;'>

            <h2 style='margin:0;'>Future College</h2>

            <p style='margin-top:8px;'>Thank You for Contacting Us</p>

        </div>

        <div style='padding:35px;'>

            <p>Dear <strong>{$fullName}</strong>,</p>

            <p>
                Thank you for submitting your admission enquiry.
                We have successfully received your enquiry.
            </p>

            <p>
                Our admission counsellor will contact you shortly regarding
                admission, eligibility, fees, scholarships and course details.
            </p>

            <table width='100%' cellpadding='10' cellspacing='0' style='border-collapse:collapse;border:1px solid #eeeeee;margin:25px 0;'>

                <tr>
                    <td><strong>Course</strong></td>
                    <td>{$course}</td>
                </tr>

                <tr style='background:#f7f7f7'>
                    <td><strong>City</strong></td>
                    <td>{$city}</td>
                </tr>

                <tr>
                    <td><strong>Email</strong></td>
                    <td>{$email}</td>
                </tr>

                <tr style='background:#f7f7f7'>
                    <td><strong>Mobile</strong></td>
                    <td>{$mobile}</td>
                </tr>

            </table>

            <p>
                If you have any questions, simply reply to this email or
                contact our admission office.
            </p>

            <p>
                Regards,<br>
                <strong>Future College Admission Team</strong>
            </p>

        </div>

        <div style='background:#f5f5f5;padding:20px;text-align:center;font-size:13px;color:#777;'>

            © {$currentYear} Future College. All Rights Reserved.

        </div>

    </div>

    ";

    $mail->send();

    $response = [
        'status' => true,
        'message' => 'Your admission enquiry has been submitted successfully.'
    ];

} catch ( Exception $e ) {

    $response = [
        'status' => false,
        'message' => $mail->ErrorInfo,
        'exception' => $e->getMessage()
    ];

}

echo json_encode( $response );

exit;