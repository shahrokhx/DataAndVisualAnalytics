package edu.gatech.cse6242;

import java.io.IOException;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class Q1a {

  public static void main(String[] args) throws Exception {
    Configuration conf = new Configuration();
    Job job = Job.getInstance(conf, "Q1a");

    /* TO DO: Needs to be implemented */
    job.setJarByClass(Q1a.class);
    job.setMapperClass(MainMapper.class);
    job.setCombinerClass(MainReducer.class);
    job.setReducerClass(MainReducer.class);
    job.setOutputKeyClass(IntWritable.class);
    job.setOutputValueClass(IntWritable.class);
    

    FileInputFormat.addInputPath(job, new Path(args[0]));
    FileOutputFormat.setOutputPath(job, new Path(args[1]));
    //System.out.println("Input : "+args[0]);
    //System.out.println("Output: "+args[1]);
    
    System.exit(job.waitForCompletion(true) ? 0 : 1);
  }
  
  public static class MainMapper extends Mapper<Object, Text, IntWritable, IntWritable>{
	  
	  public void map(Object key, Text value, Context context) throws IOException, InterruptedException{
		  
		  String row = value.toString();
		  if (!row.trim().isEmpty()){
			  String[] col = row.split("\t");
			  
			  IntWritable source = new IntWritable(Integer.parseInt(col[0]));
			  IntWritable target = new IntWritable(Integer.parseInt(col[1]));
			  IntWritable weight = new IntWritable(Integer.parseInt(col[2]));
			  
			  context.write(source, weight);
		  } 
	  }
  }
  
  public static class MainReducer extends Reducer<IntWritable,IntWritable,IntWritable,IntWritable> {

      public void reduce(IntWritable key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
    	  
    	  int max = 0; 
    			  
    	  for (IntWritable value : values){
    		  int currentValue = value.get();
    		  if (currentValue > max)
    			  max = currentValue;
    	  }
    	  context.write(key, new IntWritable(max));
      }
  }
  
  
}
