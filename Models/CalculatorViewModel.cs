using System.ComponentModel.DataAnnotations;

namespace AspNetCoreCalculator.Models;

public class CalculatorViewModel
{
    [Display(Name = "First number")]
    public decimal FirstNumber { get; set; }

    [Display(Name = "Second number")]
    public decimal SecondNumber { get; set; }

    [Required]
    public string Operation { get; set; } = "add";

    public decimal? Result { get; set; }
}
