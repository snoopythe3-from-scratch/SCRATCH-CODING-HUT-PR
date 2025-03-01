<?php
session_start();

// Function to check if a Scratch username exists
function checkScratchUser($username) {
    $url = "https://api.scratch.mit.edu/users/$username/";
    $response = @file_get_contents($url);
    return $response !== false;
}

// Function to generate an RSA key pair
function generateKeyPair($username) {
    $config = [
        "private_key_bits" => 2048,
        "private_key_type" => OPENSSL_KEYTYPE_RSA,
    ];
    $res = openssl_pkey_new($config);
    openssl_pkey_export($res, $privateKey);
    $publicKey = openssl_pkey_get_details($res)["key"];

    // Store public key on server
    file_put_contents("keys/$username.pub", $publicKey);
    
    // Return private key to the user (normally, you'd encrypt this before sending)
    return $privateKey;
}

// Handle user registration and key generation
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["username"])) {
    $username = trim($_POST["username"]);
    
    if (!checkScratchUser($username)) {
        echo json_encode(["error" => "Invalid Scratch username."]);
        exit;
    }
    
    $privateKey = generateKeyPair($username);
    $_SESSION["username"] = $username;
    echo json_encode(["privateKey" => $privateKey]);
    exit;
}

// Handle authentication challenge
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["challengeResponse"])) {
    $username = $_SESSION["username"] ?? "";
    $challengeResponse = trim($_POST["challengeResponse"]);
    $publicKeyPath = "keys/$username.pub";
    
    if (!file_exists($publicKeyPath)) {
        echo json_encode(["error" => "User not registered."]);
        exit;
    }
    
    $publicKey = file_get_contents($publicKeyPath);
    openssl_public_decrypt(base64_decode($challengeResponse), $decrypted, $publicKey);
    
    if ($decrypted === $_SESSION["challenge"] ?? "") {
        $_SESSION["authenticated"] = true;
        echo json_encode(["success" => "Login successful!"]);
    } else {
        echo json_encode(["error" => "Invalid key response."]);
    }
    exit;
}
