import React, { useState, useEffect, useRef } from 'react';

const API_URL = '/api';

function App() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal] = useState({ open: false, filename: null });
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const [registerMsg, setRegisterMsg] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginMsg, setLoginMsg] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const fileInput = useRef();

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/files`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setFiles(data.files || []));
  }, [uploading, token]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    setUploading(false);
    fileInput.current.value = '';
  };

  const getMiniLink = (filename) => token ? `${API_URL}/file?filename=${encodeURIComponent(filename)}&token=${token}` : '#';

  const handleDelete = async (filename) => {
    setModal({ open: true, filename });
  };

  const confirmDelete = async () => {
    if (!modal.filename) return;
    await fetch(`${API_URL}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ filename: modal.filename })
    });
    setFiles(files.filter(f => f !== modal.filename));
    setModal({ open: false, filename: null });
  };

  const cancelDelete = () => setModal({ open: false, filename: null });

  return (
    <div className="container">
      <h2>Stockage Cloud créé par Thiago</h2>
      {!user && (
        <>
          <button className="upload-btn" style={{ background: '#2563eb', marginBottom: 16 }} onClick={() => setShowRegister(true)}>
            Créer un compte
          </button>
          <button className="upload-btn" style={{ background: '#4f8cff', marginBottom: 16, marginLeft: 8 }} onClick={() => setShowLogin(true)}>
            Se connecter
          </button>
        </>
      )}
      {showRegister && (
        <div className="modal-bg">
          <div className="modal">
            <div className="modal-title">Créer un compte</div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                setRegisterMsg(null);
                if (!registerData.username || !registerData.password) {
                  setRegisterMsg('Preencha todos os campos.');
                  return;
                }
                try {
                  const res = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registerData)
                  });
                  let data = {};
                  try {
                    data = await res.json();
                  } catch {
                    setRegisterMsg('Resposta inválida do servidor.');
                    return;
                  }
                  if (res.ok) {
                    setRegisterMsg('Conta criada com sucesso!');
                    setTimeout(() => {
                      setShowRegister(false);
                      setRegisterMsg(null);
                      setRegisterData({ username: '', password: '' });
                    }, 1200);
                  } else {
                    setRegisterMsg(data.error || 'Erro ao criar conta.');
                  }
                } catch (err) {
                  setRegisterMsg('Erro de rede. Verifique sua conexão.');
                }
              }}
            >
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={registerData.username}
                onChange={e => setRegisterData({ ...registerData, username: e.target.value })}
                style={{ width: '90%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={registerData.password}
                onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                style={{ width: '90%', marginBottom: 18, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
                required
              />
              {registerMsg && <div style={{ color: registerMsg.includes('succès') ? '#2563eb' : '#ff4d4f', marginBottom: 10 }}>{registerMsg}</div>}
              <div className="modal-btns">
                <button className="modal-btn confirm" type="submit">Créer</button>
                <button className="modal-btn cancel" type="button" onClick={() => { setShowRegister(false); setRegisterMsg(null); }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {user && (
        <>
          <button className="upload-btn" onClick={() => fileInput.current.click()}>
            Choisir un fichier à envoyer
          </button>
          <input
            type="file"
            style={{ display: 'none' }}
            ref={fileInput}
            onChange={handleUpload}
          />
          <div style={{ margin: '10px 0 18px 0', color: '#2563eb', fontWeight: 500 }}>
            Connecté comme <span style={{ fontWeight: 700 }}>{user}</span>
            <button
              style={{ marginLeft: 10, background: '#eee', border: 'none', borderRadius: 5, padding: '2px 10px', cursor: 'pointer' }}
              onClick={() => { setUser(null); setToken(null); }}
            >
              Déconnexion
            </button>
          </div>
        </>
      )}
      {showLogin && (
        <div className="modal-bg">
          <div className="modal">
            <div className="modal-title">Connexion</div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                setLoginMsg(null);
                if (!loginData.username || !loginData.password) {
                  setLoginMsg('Preencha todos os campos.');
                  return;
                }
                try {
                  const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loginData)
                  });
                  let data = {};
                  try {
                    data = await res.json();
                  } catch {
                    setLoginMsg('Resposta inválida do servidor.');
                    return;
                  }
                  if (res.ok) {
                    setLoginMsg('Login realizado com sucesso!');
                    setUser(loginData.username);
                    setToken(data.token);
                    setTimeout(() => {
                      setShowLogin(false);
                      setLoginMsg(null);
                      setLoginData({ username: '', password: '' });
                    }, 1200);
                  } else {
                    setLoginMsg(data.error || 'Erro ao fazer login.');
                  }
                } catch (err) {
                  setLoginMsg('Erro de rede. Verifique sua conexão.');
                }
              }}
            >
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={loginData.username}
                onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                style={{ width: '90%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                style={{ width: '90%', marginBottom: 18, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
                required
              />
              {loginMsg && <div style={{ color: loginMsg.includes('succès') ? '#2563eb' : '#ff4d4f', marginBottom: 10 }}>{loginMsg}</div>}
              <div className="modal-btns">
                <button className="modal-btn confirm" type="submit">Se connecter</button>
                <button className="modal-btn cancel" type="button" onClick={() => { setShowLogin(false); setLoginMsg(null); }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {user && (
        <>
          <h3>Fichiers envoyés</h3>
          <ul className="file-list fade-in">
            {files.length === 0 && <li>Aucun fichier envoyé pour l'instant.</li>}
            {files.map(f => (
              <li key={f}>
                {f.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img src={getMiniLink(f)} alt={f} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, marginRight: 10 }} />
                ) : f.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={getMiniLink(f)} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, marginRight: 10 }} muted preload="metadata" />
                ) : null}
                <a
                  className="file-link"
                  href={getMiniLink(f)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir
                </a>
                <span className="mini-link">{getMiniLink(f)}</span>
                <button
                  style={{ marginLeft: 12, background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}
                  onClick={() => handleDelete(f)}
                  title="Supprimer le fichier"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {modal.open && (
        <div className="modal-bg">
          <div className="modal">
            <div className="modal-title">Êtes-vous sûr de vouloir supprimer ce fichier ?</div>
            <div style={{ color: '#ff4d4f', marginBottom: 12, fontWeight: 500 }}>
              Ce fichier sera supprimé définitivement. Continuer ?
            </div>
            <div className="modal-btns">
              <button className="modal-btn confirm" onClick={confirmDelete}>Supprimer</button>
              <button className="modal-btn cancel" onClick={cancelDelete}>Annuler</button>
            </div>
          </div>
        </div>
      )}
      <div className="copyright">© {new Date().getFullYear()} Thiago Gomes</div>
    </div>
  );
}

export default App;
