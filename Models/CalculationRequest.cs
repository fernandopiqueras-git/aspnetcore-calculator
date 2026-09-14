namespace AspNetCoreCalculator.Models;

public class CalculationRequest
{
    public double FirstNumber { get; set; }
    public double? SecondNumber { get; set; }
    public string Operation { get; set; } = string.Empty;
}
