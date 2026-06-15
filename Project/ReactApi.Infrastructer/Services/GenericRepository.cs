using ReactApi.Application.Presistance;
using ReactApi.Infrastructer.Data;

namespace ReactApi.Infrastructer.Services
{
    public class GenericRepository<Entity> : IGenericRepository<Entity> where Entity : class
    {
        private ApplicationDbContext context;


        public GenericRepository(ApplicationDbContext context)
        {
            this.context = context;
        }
        public List<Entity> GetAll()
        {
            var list = context.Set<Entity>().ToList();
            return list;
        }
        public Entity? GetbyId(int Id)
        {
            var FindId = context.Set<Entity>().Find(Id);
            return FindId;
        }

        public void Add(Entity entity)
        {
            context.Set<Entity>().Add(entity);
        }

        public void Update(Entity entity)
        {
            context.Set<Entity>().Update(entity);
        }
        public void Delete(Entity entity)
        {
            context.Set<Entity>().Remove(entity);
        }


    }

}
