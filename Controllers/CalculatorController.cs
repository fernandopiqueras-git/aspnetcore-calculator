using AspNetCoreCalculator.Models;
using AspNetCoreCalculator.Services;
using Microsoft.AspNetCore.Mvc;

namespace AspNetCoreCalculator.Controllers;

public class CalculatorController(ICalculatorService calculatorService) : Controller
{
    [HttpGet]
    public IActionResult Index()
    {
        return View(new CalculatorViewModel());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Index(CalculatorViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        try
        {
            model.Result = calculatorService.Calculate(
                model.FirstNumber,
                model.SecondNumber,
                model.Operation);
        }
        catch (DivideByZeroException exception)
        {
            ModelState.AddModelError(nameof(model.SecondNumber), exception.Message);
        }
        catch (ArgumentException exception)
        {
            ModelState.AddModelError(nameof(model.Operation), exception.Message);
        }

        return View(model);
    }
}
