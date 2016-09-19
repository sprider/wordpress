using System;

namespace SPOL_REST_Test
{
    public class Program
    {
        static void Main(string[] args)
        {
            try
            {
                ProcessRequests.Exec();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message); 
            }

            Console.Read();
        }
    }
}