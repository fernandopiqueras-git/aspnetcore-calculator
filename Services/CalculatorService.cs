namespace AspNetCoreCalculator.Services;

public class CalculatorService : ICalculatorService
{
    public double Calculate(double firstNumber, double? secondNumber, string operation)
    {
        var result = operation switch
        {
            "add" => firstNumber + RequireSecondNumber(secondNumber),
            "subtract" => firstNumber - RequireSecondNumber(secondNumber),
            "multiply" => firstNumber * RequireSecondNumber(secondNumber),
            "divide" => Divide(firstNumber, RequireSecondNumber(secondNumber)),
            "power" => Math.Pow(firstNumber, RequireSecondNumber(secondNumber)),
            "square" => Math.Pow(firstNumber, 2),
            "sqrt" => SquareRoot(firstNumber),
            "reciprocal" => Reciprocal(firstNumber),
            "percent" => firstNumber / 100,
            "factorial" => Factorial(firstNumber),
            "sin" => Math.Sin(ToRadians(firstNumber)),
            "cos" => Math.Cos(ToRadians(firstNumber)),
            "tan" => Tangent(firstNumber),
            "log" => Logarithm(firstNumber, false),
            "ln" => Logarithm(firstNumber, true),
            _ => throw new ArgumentException("La operación no es válida.", nameof(operation))
        };

        if (double.IsNaN(result) || double.IsInfinity(result))
            throw new ArithmeticException("El resultado está fuera del rango permitido.");

        return result;
    }

    private static double RequireSecondNumber(double? secondNumber)
    {
        return secondNumber ?? throw new ArgumentException("La operación necesita dos números.");
    }

    private static double Divide(double firstNumber, double secondNumber)
    {
        if (secondNumber == 0)
            throw new DivideByZeroException("No se puede dividir entre cero.");

        return firstNumber / secondNumber;
    }

    private static double SquareRoot(double value)
    {
        if (value < 0)
            throw new ArgumentOutOfRangeException(nameof(value), "No existe raíz cuadrada real de un número negativo.");

        return Math.Sqrt(value);
    }

    private static double Reciprocal(double value)
    {
        if (value == 0)
            throw new DivideByZeroException("El cero no tiene inverso.");

        return 1 / value;
    }

    private static double Factorial(double value)
    {
        if (value < 0 || value % 1 != 0 || value > 170)
            throw new ArgumentOutOfRangeException(nameof(value), "El factorial necesita un entero entre 0 y 170.");

        var result = 1d;

        for (var number = 2; number <= value; number++)
            result *= number;

        return result;
    }

    private static double Tangent(double degrees)
    {
        var normalizedDegrees = Math.Abs(degrees % 180);

        if (Math.Abs(normalizedDegrees - 90) < 0.0000000001)
            throw new ArgumentOutOfRangeException(nameof(degrees), "La tangente no está definida para este ángulo.");

        return Math.Tan(ToRadians(degrees));
    }

    private static double Logarithm(double value, bool natural)
    {
        if (value <= 0)
            throw new ArgumentOutOfRangeException(nameof(value), "El logaritmo necesita un número mayor que cero.");

        return natural ? Math.Log(value) : Math.Log10(value);
    }

    private static double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }
}
