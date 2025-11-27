// Services/IRangoService.cs
using EcoPulse.Api.Models;

namespace EcoPulse.Api.Services
{
    public interface IRangoService
    {
        string ObtenerRangoPorPuntos(int puntos);
        (string rangoActual, string siguienteRango, int progresoPorcentaje) ObtenerProgresoRango(int puntos);
        (string color, string icon) ObtenerEstiloRango(string rango);
    }

    public class RangoService : IRangoService
    {
        public string ObtenerRangoPorPuntos(int puntos)
        {
            if (puntos >= 500) return "Oro";
            if (puntos >= 250) return "Plata";
            if (puntos >= 100) return "Bronce";
            return "Novato";
        }

        public (string rangoActual, string siguienteRango, int progresoPorcentaje) ObtenerProgresoRango(int puntos)
        {
            var rangoActual = ObtenerRangoPorPuntos(puntos);
            
            string siguienteRango = rangoActual switch
            {
                "Novato" => "Bronce",
                "Bronce" => "Plata",
                "Plata" => "Oro",
                "Oro" => null, 
                _ => null
            };

            if (siguienteRango == null)
            {
                return (rangoActual, null, 100);
            }

            int puntosMinimosActual = ObtenerPuntosMinimos(rangoActual);
            int puntosMinimosSiguiente = ObtenerPuntosMinimos(siguienteRango);
            
            var progreso = (int)((double)(puntos - puntosMinimosActual) / (puntosMinimosSiguiente - puntosMinimosActual) * 100);

            return (rangoActual, siguienteRango, Math.Min(progreso, 100));
        }

        public (string color, string icon) ObtenerEstiloRango(string rango)
        {
            return rango switch
            {
                "Oro" => ("from-yellow-400 to-orange-500", "🥇"),
                "Plata" => ("from-gray-300 to-slate-400", "🥈"),
                "Bronce" => ("from-orange-400 to-red-500", "🥉"),
                "Novato" => ("from-blue-300 to-cyan-400", "🏅"),
                _ => ("from-gray-300 to-slate-400", "❓")
            };
        }

        private int ObtenerPuntosMinimos(string rango)
        {
            return rango switch
            {
                "Novato" => 0,
                "Bronce" => 100,
                "Plata" => 250,
                "Oro" => 500,
                _ => 0
            };
        }
    }
}