import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getCentros } from '@/Service/CentroServices';
import { getMateriales } from '@/Service/MaterialService';
import { createEntrega } from '@/Service/EntregaService';

// Simplified SVG Icons replacing Lucide-React imports
const ArrowLeft = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
);
const CheckCircle = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M9 11l3 3L22 4" /></svg>
);
const QRIcon = (props) => (
  <svg {...props} className="w-5 h-5 inline mr-2 -mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="8" x="2" y="2" rx="1" /><rect width="8" height="8" x="14" y="2" rx="1" /><rect width="8" height="8" x="8" y="14" rx="1" /><path d="M5 14v.5" /><path d="M19 5v.5" /><path d="M14 19h.5" /></svg>
);

/**
 * Componente que genera un código QR utilizando la librería qrcode.js (cargada vía CDN).
 */
const ScannableQRCodeGenerator = ({ data, size = 120 }) => {
  const qrRef = useRef(null);
  const [isLibLoaded, setIsLibLoaded] = useState(false);

  // Cargar la librería qrcode.js desde un CDN
  useEffect(() => {
    if (window.QRCode) {
      setIsLibLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => setIsLibLoaded(true);
    script.onerror = () => console.error("Error al cargar la librería QRCode.js");
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Generar el QR una vez que la librería esté cargada y los datos cambien
  useEffect(() => {
    if (isLibLoaded && qrRef.current && data) {
      qrRef.current.innerHTML = '';
      new window.QRCode(qrRef.current, {
        text: data,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H
      });
    }
  }, [data, isLibLoaded, size]);

  if (!isLibLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full text-sm text-gray-500">
        Cargando Generador QR...
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-sm p-1"
      style={{ width: size + 20, height: size + 20 }}
    >
      <div ref={qrRef} />
    </div>
  );
};


const RegisterDelivery = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from auth context

  // State for the multi-step form
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    center: '',
    material: '',
    weight: ''
  });

  // Data states
  const [centers, setCenters] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // State for simulating toast and navigation
  const [toast, setToast] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // NEW STATES for QR simulation
  const [scanMethod, setScanMethod] = useState('manual'); // 'manual' or 'qr'
  const [qrInput, setQrInput] = useState('');
  const [isQrScanned, setIsQrScanned] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centersData, materialsData] = await Promise.all([
          getCentros(),
          getMateriales()
        ]);
        setCenters(centersData);
        setMaterials(materialsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("Error", "No se pudieron cargar los datos necesarios.", true);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Utility function to show toast notification
  const showToast = useCallback((title, description, isDestructive = false) => {
    setToast({ title, description, isDestructive });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Handlers for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;
    if (/^\d*(\.\d*)?$/.test(value) || value === '') {
      setFormData(prev => ({ ...prev, weight: value }));
    }
  };

  // Function to simulate QR code scan and parse data
  const handleQRScan = () => {
    // Expected QR data format: materialId:weight (e.g., "1:4.5")
    // Note: Updated to expect ID for material to match service logic
    const parts = qrInput.split(':');

    if (parts.length !== 2) {
      showToast("Error de QR", "Formato QR inválido. Debe ser idMaterial:peso (ej: 1:4.5)", true);
      setIsQrScanned(false);
      return;
    }

    const materialId = parseInt(parts[0]);
    const weightString = parts[1];
    const weightFloat = parseFloat(weightString);

    // Validate material and weight
    const validMaterial = materials.some(m => m.IdMaterial === materialId);
    const validWeight = !isNaN(weightFloat) && weightFloat > 0;

    if (!validMaterial || !validWeight) {
      showToast("Error de QR", "Material o peso inválido en el código QR. Revisa la entrada.", true);
      setIsQrScanned(false);
      return;
    }

    setFormData(prev => ({
      ...prev,
      material: materialId.toString(),
      weight: weightString
    }));

    setIsQrScanned(true);
    showToast("QR Escaneado", `Datos cargados: ${getMaterialLabel(materialId.toString())} y ${weightString} kg.`);
  };


  const handleSubmit = async () => {
    if (!formData.center || !formData.material || !formData.weight || parseFloat(formData.weight) <= 0) {
      showToast(
        "Error de Validación",
        "Por favor asegúrate de que todos los campos estén completos y el peso sea válido (mayor que 0).",
        true
      );
      return;
    }

    try {
      const payload = {
        IdUsuario: user?.id || user?.IdUsuario || 0, // Fallback if user not loaded
        IdMaterial: parseInt(formData.material),
        IdCentroAcopio: parseInt(formData.center),
        Cantidad: parseFloat(formData.weight)
      };

      const response = await createEntrega(payload);

      setEarnedPoints(response.PuntosGenerados);

      showToast(
        "¡Entrega registrada!",
        `Has ganado ${response.PuntosGenerados} Eco-Puntos.`,
      );

      setTimeout(() => setIsSuccess(true), 2000);

    } catch (error) {
      console.error("Error creating delivery:", error);
      showToast("Error", error.message || "No se pudo registrar la entrega.", true);
    }
  };

  // Get material label for summary
  const getMaterialLabel = (value) => {
    const id = parseInt(value);
    return materials.find(m => m.IdMaterial === id)?.Nombre || value;
  };

  // Get center label for summary
  const getCenterLabel = (value) => {
    const id = parseInt(value);
    return centers.find(c => c.IdCentroAcopio === id)?.Nombre || value;
  };

  // Calculate estimated points (client-side estimation)
  const getEstimatedPoints = () => {
    const weight = parseFloat(formData.weight || 0);
    const materialId = parseInt(formData.material);
    const material = materials.find(m => m.IdMaterial === materialId);
    const factor = material ? material.FactorPuntos : 0;
    return Math.floor(weight * factor); // Assuming FactorPuntos is per kg
  };

  // If successfully navigated, show a success message instead of the form
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Transacción Exitosa!</h2>
          <p className="text-gray-600 mb-6">Tu entrega ha sido registrada. ¡Gracias por reciclar!</p>
          <p className="text-2xl font-extrabold text-green-700">
            +{earnedPoints} Eco-Puntos
          </p>
          <button
            onClick={() => {
              setStep(1);
              setIsSuccess(false);
              setIsQrScanned(false);
              setQrInput('');
              setFormData({ center: '', material: '', weight: '' });
              navigate('/user/dashboard'); // Navigate back to dashboard
            }}
            className="mt-8 w-full py-3 px-4 text-white font-semibold bg-green-600 rounded-xl shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-[1.02]"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }


  // --- Render the Multi-Step Form ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-inter">
      {/* Toast Notification Simulation */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-sm w-full transition-opacity duration-300 ${toast.isDestructive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          style={{ animation: 'fadeInOut 3s forwards' }}
        >
          <div className="font-bold">{toast.title}</div>
          <div>{toast.description}</div>
        </div>
      )}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/user/dashboard')}
          className="mb-4 flex items-center text-green-700 hover:text-green-800 transition-colors p-2 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Volver</span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-green-200">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800 tracking-tight">
            Registrar Entrega de Reciclaje
          </h1>

          {loadingData ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando datos...</p>
            </div>
          ) : (
            <>
              {/* Progress Tracker */}
              <div className="flex items-center justify-between mb-10">
                {[1, 2, 3].map(s => (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step === s ? 'bg-green-600 text-white ring-4 ring-green-300' :
                        step > s ? 'bg-green-100 text-green-700' :
                          'bg-gray-200 text-gray-500'
                        }`}>
                        {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                      </div>
                      <span className={`mt-2 text-xs font-medium ${step >= s ? 'text-green-700' : 'text-gray-500'} hidden sm:block`}>
                        {s === 1 ? 'Centro' : s === 2 ? 'Material & Peso' : 'Confirmar'}
                      </span>
                    </div>
                    {s < 3 && <div className={`flex-grow h-1 mx-2 transition-colors duration-300 ${step > s ? 'bg-green-600' : 'bg-gray-300'}`} />}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Select Center */}
              {step === 1 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Paso 1: Seleccionar Centro de Acopio</h2>

                  <div className="space-y-2">
                    <label htmlFor="center-select" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
                      Centro de Acopio
                    </label>
                    <div className="relative">
                      <select
                        id="center-select"
                        name="center"
                        value={formData.center}
                        onChange={handleChange}
                        className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl shadow-inner focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none transition-colors"
                      >
                        <option value="" disabled>Selecciona un centro</option>
                        {centers.map(center => (
                          <option key={center.IdCentroAcopio} value={center.IdCentroAcopio}>{center.Nombre}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.center}
                    className="w-full py-3 px-4 text-white font-bold bg-green-600 rounded-xl shadow-lg hover:bg-green-700 transition duration-300 disabled:bg-green-300"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {/* Step 2: Material and Weight */}
              {step === 2 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Paso 2: Material y Peso de la Entrega</h2>

                  {/* Scan Method Toggle */}
                  <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
                    <button
                      onClick={() => { setScanMethod('manual'); setIsQrScanned(false); }}
                      className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${scanMethod === 'manual' ? 'bg-white text-green-700 shadow-md' : 'text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                      Entrada Manual
                    </button>
                    <button
                      onClick={() => setScanMethod('qr')}
                      className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${scanMethod === 'qr' ? 'bg-white text-green-700 shadow-md' : 'text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                      Escaneo QR
                    </button>
                  </div>

                  {/* Manual Input Section */}
                  {scanMethod === 'manual' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="material-select" className="text-sm font-medium leading-none block mb-2">
                          Tipo de Material
                        </label>
                        <div className="relative">
                          <select
                            id="material-select"
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                            className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl shadow-inner focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none transition-colors"
                          >
                            <option value="" disabled>Selecciona el material</option>
                            {materials.map(material => (
                              <option key={material.IdMaterial} value={material.IdMaterial}>{material.Nombre}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="weight-input" className="text-sm font-medium leading-none block mb-2">
                          Peso (kg)
                        </label>
                        <div className="relative">
                          <input
                            id="weight-input"
                            type="text" // Use text for controlled input validation
                            name="weight"
                            placeholder="e.g., 2.50"
                            value={formData.weight}
                            onChange={handleWeightChange}
                            className="w-full h-12 px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl shadow-inner focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors pr-16"
                          />
                          <span className="absolute right-0 top-0 h-12 flex items-center pr-4 text-gray-500 font-medium">kg</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Recuerda que cada kg de material reciclado te otorga puntos.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* QR Scan Simulation Section */}
                  {scanMethod === 'qr' && (
                    <div className="space-y-4 p-4 border border-dashed border-green-400 rounded-xl bg-green-50">
                      <h3 className="font-bold text-green-700">Simulación de Escaneo QR</h3>
                      <p className="text-sm text-gray-600">Ingresa el texto que simularía el código QR. Formato: `idMaterial:peso` (ej: `1:4.5`)</p>
                      <div className="space-y-2">
                        <label htmlFor="qr-input" className="text-sm font-medium leading-none block mb-1">
                          Código QR
                        </label>
                        <input
                          id="qr-input"
                          type="text"
                          placeholder="idMaterial:peso (ej: 1:4.5)"
                          value={qrInput}
                          onChange={(e) => setQrInput(e.target.value)}
                          className="w-full h-12 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-inner focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                        />
                      </div>
                      <button
                        onClick={handleQRScan}
                        className="w-full py-3 px-4 text-white font-bold bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 flex items-center justify-center"
                        disabled={qrInput.trim() === ''}
                      >
                        <QRIcon />
                        Escanear/Cargar Datos QR
                      </button>

                      {isQrScanned && (
                        <div className="mt-4 p-3 bg-white border border-green-500 rounded-lg text-sm shadow-md">
                          <p className="font-semibold text-green-700 mb-1">✅ Datos QR Cargados al Formulario:</p>
                          <p className="flex justify-between">Material: <span className="font-mono font-medium">{getMaterialLabel(formData.material)}</span></p>
                          <p className="flex justify-between">Peso: <span className="font-mono font-medium">{formData.weight} kg</span></p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 px-4 text-gray-700 font-bold bg-gray-100 rounded-xl border border-gray-300 shadow-md hover:bg-gray-200 transition duration-300"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      // Check if using manual or QR scan method for validation
                      disabled={!formData.material || !formData.weight || parseFloat(formData.weight) <= 0 || (scanMethod === 'qr' && !isQrScanned)}
                      className="flex-1 py-3 px-4 text-white font-bold bg-green-600 rounded-xl shadow-lg hover:bg-green-700 transition duration-300 disabled:bg-green-300"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Paso 3: Confirmar Entrega</h2>

                  <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-300 shadow-inner flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 space-y-3 text-gray-700 w-full md:w-auto">
                      <h3 className="text-xl font-bold mb-4 text-green-800">Resumen de Entrega</h3>
                      <p className="flex justify-between items-center text-sm"><span className="font-semibold">ID de Usuario:</span> <span className="font-mono font-medium text-right">{user?.id || "N/A"}</span></p>
                      <p className="flex justify-between items-center"><span className="font-semibold">Centro de Acopio:</span> <span className="font-medium text-right">{getCenterLabel(formData.center)}</span></p>
                      <hr className="border-green-200" />
                      <p className="flex justify-between items-center"><span className="font-semibold">Tipo de Material:</span> <span className="font-medium text-right">{getMaterialLabel(formData.material)}</span></p>
                      <hr className="border-green-200" />
                      <p className="flex justify-between items-center"><span className="font-semibold">Peso Registrado:</span> <span className="font-medium text-right text-lg text-green-700">{parseFloat(formData.weight).toFixed(2)} kg</span></p>
                      <hr className="border-green-200" />
                      <div className="pt-4 flex justify-between items-center bg-green-100/50 -mx-6 px-6 py-3 rounded-b-xl">
                        <span className="font-extrabold text-xl text-green-900">Eco-Puntos Estimados:</span>
                        <span className="text-2xl font-extrabold text-green-700">
                          ~{getEstimatedPoints()}
                        </span>
                      </div>
                    </div>

                    {/* QR Code (PROFESIONAL y ESCANEABLE) */}
                    <div className="flex-none flex flex-col items-center justify-center w-full md:w-48 h-48 bg-white rounded-xl shadow-lg border border-gray-200 p-2">
                      <h4 className="text-xs font-semibold text-gray-600 mb-1">Código de Entrega</h4>
                      {formData.material && formData.weight && parseFloat(formData.weight) > 0 ? (
                        <ScannableQRCodeGenerator
                          data={`${user?.id || 'USER'}:${formData.material}:${formData.weight}`}
                          size={120}
                        />
                      ) : (
                        <div className="text-gray-400 text-sm text-center">
                          QR no disponible<br />(Datos incompletos)
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 px-4 text-gray-700 font-bold bg-gray-100 rounded-xl border border-gray-300 shadow-md hover:bg-gray-200 transition duration-300"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 py-3 px-4 text-white font-bold bg-green-600 rounded-xl shadow-lg hover:bg-green-700 transition duration-300"
                    >
                      Confirmar Entrega
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterDelivery;