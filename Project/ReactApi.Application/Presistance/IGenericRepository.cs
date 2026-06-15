using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Presistance
{
    public interface IGenericRepository<Entity> where Entity : class
    {
        List<Entity> GetAll();
        Entity? GetbyId(int Id);
        void Add(Entity entity);
        void Update(Entity entity);
        void Delete(Entity entity);

    }
}
