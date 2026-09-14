namespace AspNetCoreCalculator.Services;

public interface ICalculatorService
{
    double Calculate(double firstNumber, double? secondNumber, string operation);
}
