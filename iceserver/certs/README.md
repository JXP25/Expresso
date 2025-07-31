# SSL Certificates Setup for Coturn ICE Server

This directory contains SSL certificates required for HTTPS/TLS support in your coturn ICE server.

## Required Files

Place the following files in this directory:

- `cert.pem` - SSL certificate file
- `privkey.pem` - Private key file

## Setup Instructions

### Option 1: Self-Signed Certificate (Development/Testing)

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout privkey.pem -out cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=ice.expresso.jxp.codes"
```

### Option 2: Let's Encrypt Certificate (Production)

```bash
# Install certbot
sudo apt update
sudo apt install certbot

# Get certificate for your domain
sudo certbot certonly --standalone -d ice.expresso.jxp.codes

# Copy certificates to this directory
sudo cp /etc/letsencrypt/live/ice.expresso.jxp.codes/fullchain.pem ./cert.pem
sudo cp /etc/letsencrypt/live/ice.expresso.jxp.codes/privkey.pem ./privkey.pem

# Set proper permissions
sudo chown $USER:$USER cert.pem privkey.pem
chmod 644 cert.pem
chmod 600 privkey.pem
```

### Option 3: Custom Certificate Authority

If you have certificates from another CA:

1. Copy your certificate file to `cert.pem`
2. Copy your private key to `privkey.pem`
3. Ensure proper permissions (644 for cert, 600 for key)

## File Permissions

Ensure proper file permissions:

```bash
chmod 644 cert.pem
chmod 600 privkey.pem
```

## Verification

After setup, verify your certificates:

```bash
# Check certificate details
openssl x509 -in cert.pem -text -noout

# Test private key
openssl rsa -in privkey.pem -check
```

## Docker Deployment

The certificates will be automatically mounted into the coturn container at `/etc/coturn/`.

## Troubleshooting

- **Permission denied**: Ensure proper file permissions
- **Certificate not found**: Check file names match exactly
- **Invalid certificate**: Verify certificate is valid and not expired
- **Domain mismatch**: Ensure certificate CN matches your domain

## Security Notes

- Keep private keys secure and never commit them to version control
- Use strong passwords for private keys
- Regularly renew certificates (especially Let's Encrypt)
- Monitor certificate expiration dates
