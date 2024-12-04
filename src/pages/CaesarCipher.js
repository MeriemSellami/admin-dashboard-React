import React, { useState } from 'react';
import { Layout, Input, Button, Row, Col, Card, message } from 'antd';
import CryptoJS from 'crypto-js';

const { Content } = Layout;

const EncryptionPage = () => {
  const [caesarText, setCaesarText] = useState('');
  const [caesarKey, setCaesarKey] = useState('');
  const [caesarResult, setCaesarResult] = useState('');

  const [aesText, setAesText] = useState('');
  const [aesKey, setAesKey] = useState('');
  const [aesResult, setAesResult] = useState('');

  const isValidText = (text) => /^[a-zA-Z]+$/.test(text);

  // Caesar Cipher Functions
  const caesarEncrypt = () => {
    if (!isValidText(caesarText)) {
      message.error('Text must contain only letters!');
      return;
    }
    const shift = parseInt(caesarKey, 10) || 0;
    const encrypted = caesarText.replace(/[a-z]/gi, (char) => {
      const charCode = char.charCodeAt(0);
      const base = char >= 'a' ? 97 : 65;
      return String.fromCharCode(((charCode - base + shift) % 26) + base);
    });
    setCaesarResult(encrypted);
  };

  const caesarDecrypt = () => {
    if (!isValidText(caesarText)) {
      message.error('Text must contain only letters!');
      return;
    }
    const shift = parseInt(caesarKey, 10) || 0;
    const decrypted = caesarText.replace(/[a-z]/gi, (char) => {
      const charCode = char.charCodeAt(0);
      const base = char >= 'a' ? 97 : 65;
      return String.fromCharCode(((charCode - base - shift + 26) % 26) + base);
    });
    setCaesarResult(decrypted);
  };

  // AES Functions
  const aesEncrypt = () => {
    if (aesKey.length !== 16) {
      message.error('AES key must be 16 characters long (128 bits)');
      return;
    }
    try {
      const encrypted = CryptoJS.AES.encrypt(aesText, aesKey).toString();
      setAesResult(encrypted);
    } catch (err) {
      message.error('Encryption failed. Check your inputs.');
    }
  };

  const aesDecrypt = () => {
    if (aesKey.length !== 16) {
      message.error('AES key must be 16 characters long (128 bits)');
      return;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(aesText, aesKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      setAesResult(decrypted || 'Invalid Key or Text');
    } catch (err) {
      message.error('Decryption failed. Check your inputs.');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', padding: '20px' }}>
      <Content>
        <Row gutter={16}>
          {/* Caesar Cipher */}
          <Col span={12}>
            <Card title="Caesar Cipher" bordered>
              <Input
                placeholder="Enter text"
                value={caesarText}
                onChange={(e) => setCaesarText(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <Input
                placeholder="Enter key (number)"
                value={caesarKey}
                onChange={(e) => setCaesarKey(e.target.value)}
                type="number"
                style={{ marginBottom: '10px' }}
              />
              <div style={{ marginBottom: '10px' }}>
                <Button type="primary" onClick={caesarEncrypt} style={{ marginRight: '10px' }}>
                  Encrypt
                </Button>
                <Button type="default" onClick={caesarDecrypt}>
                  Decrypt
                </Button>
              </div>
              <Input.TextArea
                value={caesarResult}
                readOnly
                placeholder="Result"
                style={{ marginBottom: '10px' }}
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(caesarResult);
                  message.success('Result copied to clipboard!');
                }}
              >
                Copy Result
              </Button>
            </Card>
          </Col>

          {/* AES Encryption */}
          <Col span={12}>
            <Card title="AES Encryption" bordered>
              <Input
                placeholder="Enter text"
                value={aesText}
                onChange={(e) => setAesText(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <Input
                placeholder="Enter key (16 characters)"
                value={aesKey}
                onChange={(e) => setAesKey(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <div style={{ marginBottom: '10px' }}>
                <Button type="primary" onClick={aesEncrypt} style={{ marginRight: '10px' }}>
                  Encrypt
                </Button>
                <Button type="default" onClick={aesDecrypt}>
                  Decrypt
                </Button>
              </div>
              <Input.TextArea
                value={aesResult}
                readOnly
                placeholder="Result"
                style={{ marginBottom: '10px' }}
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(aesResult);
                  message.success('Result copied to clipboard!');
                }}
              >
                Copy Result
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default EncryptionPage;
