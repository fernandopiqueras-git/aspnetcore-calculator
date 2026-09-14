namespace AspNetCoreCalculator.Services;

public interface ICalculatorService
{
    decimal Calculate(decimal firstNumber, decimal secondNumber, string operation);
}
