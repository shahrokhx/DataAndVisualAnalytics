package edu.gatech.cse6242;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.Mapper.Context;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class Q1b {
  public static void main(String[] args) throws Exception {
    Configuration conf = new Configuration();
    Job job = Job.getInstance(conf, "Q1b");
    
    /* TO DO: Needs to be implemented */
    System.out.println("----------------------- Using Composite Key (Q1b) -----------------------");
    job.setJarByClass(Q1b.class);
    
    job.setMapperClass(MainMapper.class);
    job.setPartitionerClass(CustomPartitioner.class);
    job.setGroupingComparatorClass(CustomComparator.class);
    job.setReducerClass(MainReducer.class);
    
    job.setOutputKeyClass(CompositeKey.class);
    job.setOutputValueClass(NullWritable.class);
    
    FileInputFormat.addInputPath(job, new Path(args[0]));
    FileOutputFormat.setOutputPath(job, new Path(args[1]));
    System.exit(job.waitForCompletion(true) ? 0 : 1);
  }
  //---------------------------------------------------------------------------------------------------//
  public static class CompositeKey implements Writable, WritableComparable<CompositeKey>{
	  
	  private IntWritable source = new IntWritable();
	  private IntWritable target = new IntWritable();
	  private IntWritable weight = new IntWritable();
	  
	  public CompositeKey(){
	  }
	  
	  public CompositeKey(int src, int tgt, int wgt){
		  source.set(src);
		  target.set(tgt);
		  weight.set(wgt);
	  }
	  
	  public IntWritable getSource(){
		  return source;
	  }
	  
	  public IntWritable getTarget(){
		  return target;
	  }
	  
	  public IntWritable getWeight(){
		  return weight;
	  }
	  
	  public void setSource(int src){
		  source.set(src);
	  }
	  
	  public void setTarget(int tgt){
		  target.set(tgt);
	  }
	  
	  public void setWeight(int wgt){
		  weight.set(wgt);
	  }
	  
	  @Override
	  public void write(DataOutput out) throws IOException{
		  source.write(out);
		  target.write(out);
		  weight.write(out);
	  }
	  
	  @Override
	  public void readFields(DataInput in) throws IOException{
		  source.readFields(in);
		  target.readFields(in);
		  weight.readFields(in);
	  }
	  
	  @Override
	  public int compareTo(CompositeKey ck){
		  if (ck==null)
			  return 0;
		  int compare = target.compareTo(ck.getTarget()); //compare by target node ID (ASCENDING)
		  if (compare==0){
			  compare = weight.compareTo(ck.getWeight()) * (-1); //compare by weight (DESCENDING)
			  if (compare==0){
				  compare = source.compareTo(ck.getSource()); //compare by source node ID (ASCENDING)
			  }
		  }
		  return compare;
	  }
	  
	  // Maybe it is not necessary
	  public static CompositeKey read (DataInput in) throws IOException {
		  CompositeKey ck = new CompositeKey();
		  ck.readFields(in);
		  return ck;
	  }
	  
	  @Override
	  public boolean equals(Object o) {
	      //if (this == o) return true;
	      //if (o == null || getClass() != o.getClass()) return false;
	      if (o == null) return false;
	      
	      CompositeKey that = (CompositeKey) o;
	      if (weight != null ? !weight.equals(that.weight) : that.weight != null) return false;
	      if (target != null ? !target.equals(that.target) : that.target != null) return false;
	      if (source != null ? !source.equals(that.source) : that.source != null) return false;
	      
	      return true;
	  }
	  
	  
	  @Override
	  // Not sure about this one!
	  public int hashCode() {
		  int result = 1;
		  result = 31 * result + ((target == null) ? 0 : target.hashCode());
		  result = 31 * result + ((weight == null) ? 0 : weight.hashCode());
		  result = 31 * result + ((source == null) ? 0 : source.hashCode());
		  
		  return result;
	  }
	  
	  @Override
	  public String toString(){
		  return target.get() + "\t" + source.get() ;
	  }
	  
  }
  //---------------------------------------------------------------------------------------------------//
  public static class CustomPartitioner extends Partitioner<CompositeKey, NullWritable> {

	    @Override
	    public int getPartition(CompositeKey ck, NullWritable nullWritable, int numPartitions) {
	        return ck.getTarget().hashCode() % numPartitions;
	    }
	}
  //---------------------------------------------------------------------------------------------------// 
  public static class CustomComparator extends WritableComparator {
	  public CustomComparator(){
		  super(CompositeKey.class, true);
	  }
	  @Override
	  public int compare (WritableComparable obj1, WritableComparable obj2){
		  CompositeKey ck1 = (CompositeKey) obj1;
		  CompositeKey ck2 = (CompositeKey) obj2;
		  return ck1.getTarget().compareTo(ck2.getTarget());
	  }
  }
  //---------------------------------------------------------------------------------------------------//
  public static class MainMapper extends Mapper<Object, Text, CompositeKey, NullWritable>{
	  
	  private CompositeKey ck = new CompositeKey(); 
	 
	  public void map(Object key, Text value, Context context) throws IOException, InterruptedException{
		  
		  String row = value.toString();
		  if (!row.trim().isEmpty()){
			  String[] col = row.split("\t");
			  /*
			  IntWritable source = new IntWritable(Integer.parseInt(col[0]));
			  IntWritable target = new IntWritable(Integer.parseInt(col[1]));
			  IntWritable weight = new IntWritable(Integer.parseInt(col[2]));
			  */
			  
			  int src = Integer.parseInt(col[0]);
			  int tgt = Integer.parseInt(col[1]);
			  int wgt = Integer.parseInt(col[2]);
			  
			  ck.setSource(src);
			  ck.setTarget(tgt);
			  ck.setWeight(wgt);
			  
			  context.write(ck, NullWritable.get());
		  } 
	  }
  }
  //---------------------------------------------------------------------------------------------------//
  public static class MainReducer extends Reducer<CompositeKey,NullWritable,IntWritable,IntWritable> {
     

      public void reduce(CompositeKey key, Iterable<NullWritable> values, Context context) throws IOException, InterruptedException {

	   	  context.write(key.getTarget(), key.getSource());
      }
  }
  //---------------------------------------------------------------------------------------------------// 
}
