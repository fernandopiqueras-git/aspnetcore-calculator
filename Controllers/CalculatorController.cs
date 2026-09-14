using AspNetCoreCalculator.Models;
using AspNetCoreCalculator.Services;
using Microsoft.AspNetCore.Mvc;

namespace AspNetCoreCalculator.Controllers;

public class CalculatorController(ICalculatorService calculatorService) : Controller
{
    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Calculate([FromBody] CalculationRequest request)
    {
        try
        {
            var result = calculatorService.Calculate(
                request.FirstNumber,
                request.SecondNumber,
                request.Operation);

            return Ok(new { result });
        }
        catch (Exception exception) when (
            exception is ArgumentException ||
            exception is DivideByZeroException)
        {
            return BadRequest(new { error = exception.Message });
        }
    }
}
