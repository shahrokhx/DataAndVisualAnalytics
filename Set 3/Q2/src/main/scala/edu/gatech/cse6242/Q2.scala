package edu.gatech.cse6242

import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.functions._

object Q2 {

    case class Row(sender: Int, receiver: Int, weight: Int)
	def main(args: Array[String]) {
    	val sc = new SparkContext(new SparkConf().setAppName("Q2"))
		val sqlContext = new SQLContext(sc)
		import sqlContext.implicits._

    	// read the file
    	val file = sc.textFile("hdfs://localhost:8020" + args(0))
		

        /* TODO: Needs to be implemented */
		val table = file.map(_.split("\t")).map(e => Row(e(0).toInt, e(1).toInt, e(2).toInt)).toDF().filter("weight >= 10")
		
		// outgoing and incoming into two different Data Frame
		val out = table.select(table("src"),table("weight")).toDF("node","weight")
		val in  = table.select(table("tgt"),table("weight")).toDF("node","weight")
		//out.show()
		//in.show()
		
		// counting (not necessary) 
		val out_count = out.groupBy("node").count()
		val in_count = in.groupBy("node").count()

		// average weights
		val out_avg=out.groupBy("node").agg(avg("weight")).toDF("node","avg_out")
		val in_avg=in.groupBy("node").agg(-avg("weight")).toDF("node","avg_in")

		// joining into one Data Frame
		val all = out_avg.join(in_avg,"node").toDF("node","out","in")
		
		// gross average node weight
		val result = all.select(all("node"),all("out")+all("in")).toDF("node","average_weight")
		result.show()
		
		val output = result.rdd.map(r => r(0).toString + "\t" + r(1).toString)
    	
		// store output on given HDFS path.
    	
		// YOU NEED TO CHANGE THIS
    	//file.saveAsTextFile("hdfs://localhost:8020" + args(1))
        
		output.saveAsTextFile("hdfs://localhost:8020" + args(1))
  	}
}
