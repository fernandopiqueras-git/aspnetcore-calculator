using AspNetCoreCalculator.Models;
using Microsoft.AspNetCore.Mvc;

namespace AspNetCoreCalculator.Controllers;

public class CalculatorController : Controller
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

        model.Result = model.Operation switch
        {
            "add" => model.FirstNumber + model.SecondNumber,
            "subtract" => model.FirstNumber - model.SecondNumber,
            "multiply" => model.FirstNumber * model.SecondNumber,
            "divide" when model.SecondNumber != 0 => model.FirstNumber / model.SecondNumber,
            "divide" => null,
            _ => null
        };

        if (model.Operation == "divide" && model.SecondNumber == 0)
            ModelState.AddModelError(nameof(model.SecondNumber), "Division by zero is not allowed.");

        if (model.Result is null && model.Operation != "divide")
            ModelState.AddModelError(nameof(model.Operation), "Select a valid operation.");

        return View(model);
    }
}
