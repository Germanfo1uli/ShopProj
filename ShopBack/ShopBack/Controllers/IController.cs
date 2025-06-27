using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopBack.Controllers
{
    public interface IController<TDto, TCreateDto, TUpdateDto>
    {
        [HttpGet]
        Task<ActionResult<IEnumerable<TDto>>> GetAll();

        [HttpGet("{id}")]
        Task<ActionResult<TDto>> GetById(int id);

        [HttpPost]
        Task<ActionResult<TDto>> Create([FromBody] TCreateDto createDto);

        [HttpPut("{id}")]
        Task<ActionResult<TDto>> Update(int id, [FromBody] TUpdateDto updateDto);

        [HttpDelete("{id}")]
        Task<IActionResult> Delete(int id);
    }
}
