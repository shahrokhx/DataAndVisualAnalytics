package edu.gatech.cse6242;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import java.io.IOException;

public class Q4 {

    public static class Mapper1 extends Mapper<Object, Text, IntWritable, IntWritable> {

        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            
        	String row = value.toString();
            if (!row.trim().isEmpty()) {
                String[] nodeIDs = row.split("\t");
                
                IntWritable source = new IntWritable(Integer.parseInt(nodeIDs[0]));
                IntWritable target = new IntWritable(Integer.parseInt(nodeIDs[1]));

                context.write(source, new IntWritable(-1)); //out-degree
                context.write(target, new IntWritable(1));  //in-degree
            }
        }
    }

    public static class Mapper2 extends Mapper<Object, Text, IntWritable, IntWritable> {

        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {

        	String row = value.toString();
            if (!row.trim().isEmpty()) {
                String[] components = row.split("\t");

                IntWritable nodeID = new IntWritable(Integer.parseInt(components[0]));
                IntWritable diff   = new IntWritable(Integer.parseInt(components[1]));

                context.write(diff, new IntWritable(1));
            }
        }
    }

    public static class CommonReducer extends Reducer<IntWritable,IntWritable,IntWritable,IntWritable> {

        public void reduce(IntWritable key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
            int count = 0;

            for (IntWritable value : values) {
                count += value.get();
            }
            context.write(key, new IntWritable(count));
        }
    }


    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        
        // set the output delimiter
        conf.set("mapreduce.output.textoutputformat.separator", "\t");

        // Job1 : MapReduce to calculate node degree difference 
        System.out.println("---------------- Job 1: Calculating Node Degree Differences -----------------");
        Job job1 = Job.getInstance(conf, "Job1");

        job1.setJarByClass(Q4.class);
        job1.setMapperClass(Mapper1.class);
        job1.setCombinerClass(CommonReducer.class);
        job1.setReducerClass(CommonReducer.class);
        job1.setOutputKeyClass(IntWritable.class);
        job1.setOutputValueClass(IntWritable.class);

        FileInputFormat.addInputPath(job1, new Path(args[0]));
        FileOutputFormat.setOutputPath(job1, new Path("temp_file"));

        job1.waitForCompletion(true);

        // Job2 : MapReduce to calculate the frequency of diffs
        System.out.println("------------- Job 2: Calculating The Frequency of Differences ---------------");
        Job job2 = Job.getInstance(conf, "Job2");

        job2.setJarByClass(Q4.class);
        job2.setMapperClass(Mapper2.class);
        job2.setCombinerClass(CommonReducer.class);
        job2.setReducerClass(CommonReducer.class);
        job2.setOutputKeyClass(IntWritable.class);
        job2.setOutputValueClass(IntWritable.class);

        FileInputFormat.addInputPath(job2, new Path("temp_file"));
        FileOutputFormat.setOutputPath(job2, new Path(args[1]));

        System.exit(job2.waitForCompletion(true) ? 0 : 1);
    }

}
