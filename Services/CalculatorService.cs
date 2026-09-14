namespace AspNetCoreCalculator.Services;

public class CalculatorService : ICalculatorService
{
    public decimal Calculate(decimal firstNumber, decimal secondNumber, string operation)
    {
        return operation switch
        {
            "add" => firstNumber + secondNumber,
            "subtract" => firstNumber - secondNumber,
            "multiply" => firstNumber * secondNumber,
            "divide" when secondNumber != 0 => firstNumber / secondNumber,
            "divide" => throw new DivideByZeroException("Division by zero is not allowed."),
            _ => throw new ArgumentException("Select a valid operation.", nameof(operation))
        };
    }
}
