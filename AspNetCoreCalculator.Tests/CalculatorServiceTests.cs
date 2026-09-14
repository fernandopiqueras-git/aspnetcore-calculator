using AspNetCoreCalculator.Services;

namespace AspNetCoreCalculator.Tests;

public class CalculatorServiceTests
{
    private readonly CalculatorService calculator = new();

    [Theory]
    [InlineData(8, 2, "add", 10)]
    [InlineData(8, 2, "subtract", 6)]
    [InlineData(8, 2, "multiply", 16)]
    [InlineData(8, 2, "divide", 4)]
    [InlineData(8, 2, "power", 64)]
    public void Calculate_WithBinaryOperation_ReturnsExpectedResult(
        double firstNumber,
        double secondNumber,
        string operation,
        double expected)
    {
        var result = calculator.Calculate(firstNumber, secondNumber, operation);

        Assert.Equal(expected, result, 10);
    }

    [Theory]
    [InlineData(9, "sqrt", 3)]
    [InlineData(5, "factorial", 120)]
    [InlineData(90, "sin", 1)]
    [InlineData(100, "log", 2)]
    public void Calculate_WithUnaryOperation_ReturnsExpectedResult(
        double number,
        string operation,
        double expected)
    {
        var result = calculator.Calculate(number, null, operation);

        Assert.Equal(expected, result, 10);
    }

    [Fact]
    public void Divide_ByZero_ThrowsException()
    {
        Assert.Throws<DivideByZeroException>(() => calculator.Calculate(10, 0, "divide"));
    }

    [Theory]
    [InlineData(-1, "sqrt")]
    [InlineData(-1, "factorial")]
    [InlineData(0, "log")]
    [InlineData(90, "tan")]
    public void Calculate_WithInvalidValue_ThrowsException(double number, string operation)
    {
        Assert.ThrowsAny<ArgumentException>(() => calculator.Calculate(number, null, operation));
    }
}
